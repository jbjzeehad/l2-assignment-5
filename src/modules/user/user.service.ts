import httpStatus from "http-status-codes";
import AppError from "../../error/AppError";
import { IUser, UserRole } from "./user.interface";
import User from "./user.model";

const userCreate = async (payload: IUser) => {
  const isExists = await User.findOne({ email: payload.email });
  if (isExists) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }
  if (payload.role === UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannnot register as Admin");
  }
  const user = await User.create(payload);
  return user.toObject();
};

export const UserServices = {
  userCreate,
};
