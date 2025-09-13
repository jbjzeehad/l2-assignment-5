import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { UserRoutes } from "../modules/user/user.route";
import { Routes } from "./routes.interface";

const moduleRoutes: Routes[] = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/auth",
    router: AuthRoutes,
  },
  {
    path: "/parcel",
    router: ParcelRoutes,
  },
];

const router = Router();

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
