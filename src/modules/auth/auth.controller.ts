/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import catchPromise from "../../utils/Controller.Layer.Helper";
import sendResponse from "../../utils/sendResponse";
import setAuthCookie from "../../utils/setAuthCookie";
import { AuthServices } from "./auth.service";
const login = catchPromise(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { tokens, user } = await AuthServices.login(email, password);
  setAuthCookie(res, tokens);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    data: { tokens, user },
  });
});
const logout = catchPromise(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User logged out successfully",
    data: null,
  });
});
const resetPassword = catchPromise(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await AuthServices.resetPassword(oldPassword, newPassword, req.user!.email);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Password changed successfully",
    data: null,
  });
});
const newAccessToken = catchPromise(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "No refresh token found");
  }
  const accessToken = await AuthServices.newAccessToken(refreshToken);
  setAuthCookie(res, { accessToken });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "New AccessToken retrieved successfully",
    data: accessToken,
  });
});
export const AuthController = { login, logout, resetPassword, newAccessToken };
