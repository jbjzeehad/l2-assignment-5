import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error/AppError";
import catchPromise from "../../utils/Controller.Layer.Helper";
import sendResponse from "../../utils/sendResponse";
import { ParcelServices } from "./parcel.service";
const createParcel = catchPromise(async (req: Request, res: Response) => {
  const payload = req.body;
  const sender = req.user;
  if (!sender) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const parcel = await ParcelServices.createParcel(payload, sender);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel created successfully",
    data: parcel,
  });
});
const deleteParcel = catchPromise(async (req: Request, res: Response) => {
  const id = req.params.id;
  const parcel = await ParcelServices.deleteParcel(id);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel deleted successfully",
    data: parcel,
  });
});
const updateParcelAdmin = catchPromise(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;
  const result = await ParcelServices.UpdateParcel.admin(
    trackingId,
    payload,
    decodedToken
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel updated successfully",
    data: result,
  });
});
const updateParcelReceiver = catchPromise(
  async (req: Request, res: Response) => {
    const trackingId = req.params.trackingId;
    const status = req.body.status;
    const decodedToken = req.user as JwtPayload;
    if (!decodedToken) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Unauthorized access. Please login again."
      );
    }
    const result = await ParcelServices.UpdateParcel.receiver(
      trackingId,
      status,
      decodedToken
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Parcel updated successfully",
      data: result,
    });
  }
);
const updateParcelSender = catchPromise(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const payload = req.body;
  const decodedToken = req.user as JwtPayload;
  if (!decodedToken) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const result = await ParcelServices.UpdateParcel.sender(
    trackingId,
    payload,
    decodedToken
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Parcel updated successfully",
    data: result,
  });
});
const getSingleParcel = catchPromise(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const parcel = await ParcelServices.GetParcel.getSingleParcel(trackingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Parcel retrieved successfully",
    data: parcel,
  });
});
const getAllParcel = catchPromise(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const decodedToken = req.user as JwtPayload;
  if (!decodedToken) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const parcels = await ParcelServices.GetParcel.getAllParcels(
    query,
    decodedToken
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Parcel retrieved successfully",
    data: parcels.data,
    meta: parcels.meta,
  });
});
const getAllMeParcel = catchPromise(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  if (!decodedToken) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Unauthorized access. Please login again."
    );
  }
  const parcels = await ParcelServices.GetParcel.getAllMeParcels(decodedToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Parcel retrieved successfully",
    data: parcels,
  });
});
export const ParcelController = {
  createParcel,
  deleteParcel,
  updateParcelAdmin,
  updateParcelReceiver,
  updateParcelSender,
  getSingleParcel,
  getAllParcel,
  getAllMeParcel,
};
