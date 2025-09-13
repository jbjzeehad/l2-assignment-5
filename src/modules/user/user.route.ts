import { Request, Response, Router } from "express";
import checkAuth from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserRole } from "./user.interface";
import { userValidation } from "./user.validation";
const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello User" });
});
router.post(
  "/create",
  validateRequest(userValidation.userCreateSchema),
  UserController.userCreate
);
router.get("/get-all", checkAuth(UserRole.ADMIN), UserController.getAllUser);
router.patch(
  "/update/:id",
  validateRequest(userValidation.userUpdateSchema),
  checkAuth(...Object.values(UserRole)),
  UserController.userUpdate
);
router.delete(
  "/delete/:id",
  checkAuth(...Object.values(UserRole)),
  UserController.userDelete
);
router.get(
  "/:id",
  checkAuth(...Object.values(UserRole)),
  UserController.getSingleUser
);
export const UserRoutes = router;
