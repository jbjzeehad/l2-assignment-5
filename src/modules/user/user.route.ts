import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello User" });
});

router.post("/create", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello User" });
});

export const UserRoutes = router;
