import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { calculateFee } from "../../utils/calculateFee";
import { generateTrackingId } from "../../utils/parcelTrackingId";
import { UserRole } from "../user/user.interface";
import User from "../user/user.model";
import { parcelSearchableFields } from "./parcel.constants";
import {
  ICreateParcel,
  IParcel,
  ParcelStatus,
  ParcelStatusLog,
} from "./parcel.interface";
import { Parcel } from "./parcel.model";
const createParcel = async (payload: ICreateParcel, sender: JwtPayload) => {
  const receiver = await User.findOne({ email: payload.receiverEmail });
  if (!receiver) {
    throw new AppError(StatusCodes.NOT_FOUND, "Receiver not found");
  }
  const trackingId = generateTrackingId(receiver.email);
  if (payload.deliveryDate < new Date()) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Delivery date cannot be in the past"
    );
  }
  const finalPayload: IParcel = {
    ...payload,
    trackingId: trackingId,
    sender: sender!.userId,
    fromAddress: sender!.address,
    fromPhone: sender!.phone,
    receiver: receiver._id,
    toAddress: receiver.address,
    toPhone: receiver.phone,
    fee: calculateFee(payload.fee),
    isBlocked: false,
    isDeleted: false,
    status: ParcelStatus.Requested,
    statusLogs: [
      {
        location: sender!.address,
        timestamp: new Date(),
        status: ParcelStatus.Requested,
        updatedBy: sender!.userId,
        notes: "Parcel requested by sender",
      },
    ],
  };
  const parcel = await Parcel.create(finalPayload);
  const populatedParcel = await parcel.populate(
    "sender receiver",
    "-password -__v -_id -createdAt -updatedAt -isBlocked -isDeleted"
  );
  return populatedParcel.toObject();
};
const deleteParcel = async (id: string) => {
  const result = await Parcel.findByIdAndUpdate(id, { isDeleted: true });
  if (!result) {
    throw new AppError(404, "Parcel not found");
  }
  return null;
};
const admin = async (
  trackingId: string,
  payload: JwtPayload,
  admin: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }
  const { status, statusLog, ...rest } = payload;
  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status is required");
  }
  if (!statusLog) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status log is required");
  }
  result.set(rest);
  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );
  if (wasDispatched) {
    if (status === ParcelStatus.Cancelled) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Parcel already dispatched, cannot be cancelled"
      );
    }
    if (
      status !== ParcelStatus.InTransit &&
      status !== ParcelStatus.Delivered
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Parcel already dispatched, status cannot be changed to ${status}`
      );
    }
  }
  const logEntry = {
    ...statusLog,
    updatedBy: admin.userId,
    timestamp: new Date(),
    status,
  };
  result.statusLogs.push(logEntry);
  result.status = status;
  await result.save();
  const populated = await result.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );
  return populated.toObject();
};
const receiver = async (
  trackingId: string,
  status: ParcelStatus.Cancelled | ParcelStatus.Delivered,
  receiver: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }
  if (result.receiver.toString() !== receiver.userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to access this parcel!"
    );
  }
  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );
  if (status === ParcelStatus.Cancelled && wasDispatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already dispatched!");
  }
  if (status === ParcelStatus.Delivered && !wasDispatched) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Parcel has not been dispatched yet!"
    );
  }
  result.status = status;
  const logEntry: ParcelStatusLog = {
    status: status,
    updatedBy: receiver.userId,
    location: receiver.address,
    timestamp: new Date(),
    notes:
      status === ParcelStatus.Delivered
        ? "Parcel delivered to receiver"
        : "Parcel cancelled by receiver",
  };
  result.statusLogs.push(logEntry);
  await result.save({ validateBeforeSave: true });
  const populated = await result.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );
  return populated.toObject();
};
const sender = async (
  trackingId: string,
  payload: Partial<ICreateParcel>,
  sender: JwtPayload
) => {
  const result = await Parcel.findOne({ trackingId });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
  }
  if (result.sender.toString() !== sender.userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to access this parcel!"
    );
  }
  const wasDispatched = result.statusLogs.some(
    (log) => log.status === ParcelStatus.Dispatched
  );
  if (wasDispatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Parcel already dispatched!");
  }
  if (payload.receiverEmail) {
    const receiver = await User.findOne({ email: payload.receiverEmail });
    if (!receiver) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Receiver not found, cannot update parcel"
      );
    }
    payload.receiver = receiver._id;
    delete payload.receiverEmail;
  }
  if (payload.fee) {
    payload.fee = Number(calculateFee(payload.fee));
  }
  result.set(payload);
  const logEntry: ParcelStatusLog = {
    status: result.status,
    location: sender.address,
    timestamp: new Date(),
    updatedBy: sender.userId,
    notes: `Sender updated: ${Object.keys(payload).join(", ")}`,
  };
  result.statusLogs.push(logEntry);
  await result.save({ validateBeforeSave: true });
  const populated = await result.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );
  return populated.toObject();
};
const getSingleParcel = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId });
  if (!parcel) {
    throw new AppError(StatusCodes.NOT_FOUND, "Parcel does not exists");
  }
  const populated = await parcel.populate(
    "sender receiver statusLogs.updatedBy",
    "-__v -password -email -isDeleted -isBlocked -createdAt -updatedAt"
  );
  return populated.toObject();
};
const getAllParcels = async (
  query: Record<string, string>,
  decodedToken: JwtPayload
) => {
  if (decodedToken.role !== UserRole.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not authorized to access this info."
    );
  }
  const queryBuilder = new QueryBuilder(query, Parcel.find());
  const parcels = queryBuilder
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    parcels.build(true),
    queryBuilder.getMetaData(),
  ]);
  return {
    meta: meta,
    data: data,
  };
};
const getAllMeParcels = async (decodedToken: JwtPayload) => {
  const parcels = await Parcel.find({
    $or: [{ sender: decodedToken.userId }, { receiver: decodedToken.userId }],
  })
    .populate("sender receiver statusLogs.updatedBy", "-__v -password -email")
    .sort("-createdAt");
  return parcels;
};
const GetParcel = { getSingleParcel, getAllParcels, getAllMeParcels };
const UpdateParcel = { admin, receiver, sender };
export const ParcelServices = {
  createParcel,
  deleteParcel,
  UpdateParcel,
  GetParcel,
};
