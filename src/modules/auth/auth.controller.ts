import { Request, Response } from "express";
import catchPromise from "../../utils/Controller.Layer.Helper";

const login = catchPromise(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await AuthServices.login(email, password);
  setAuthCookie(res, token);
});
