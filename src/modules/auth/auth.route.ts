import { Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { AuthController } from "./auth.controller";
import { authValidation } from "./auth.validation";
const router = Router();
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  AuthController.login
);
router.post("/logout", AuthController.logout);
router.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  checkAuth(...Object.values(UserRole)),
  AuthController.resetPassword
);
router.post("/refresh-token", AuthController.newAccessToken);
export const AuthRoutes = router;
