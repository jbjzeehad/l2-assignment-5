import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchPromise from "../../../utils/Controller.Layer.Helper";
import sendResponse from "../../../utils/sendResponse";

const userCreate = catchPromise(async (req: Request, res: Response) => {
  const user = await UserServices.userCreate(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: user,
  });
});

export const UserController = {
  userCreate,
};
