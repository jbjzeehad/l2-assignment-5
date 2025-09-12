import { Router } from "express";
import { Routes } from "./routes.interface";

const moduleRoutes: Routes[] = [
    {
        path: "/user",
        router: UserRoutes,
    }
    {
        path: "/auth",
        router: AuthRoutes,
    }
    {
        path: "/parcel",
        router: ParcelRoutes,
    }
]

const router = Router();

moduleRoutes.forEach((route)=> {
    router.use(route.path, route.router);
})

export default router;

