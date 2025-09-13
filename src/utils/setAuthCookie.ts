import { Response } from "express";
type Tokens = {
  accessToken: string;
  refreshToken?: string;
};
const setAuthCookie = (res: Response, tokens: Tokens) => {
  const { accessToken, refreshToken } = tokens;
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
export default setAuthCookie;
