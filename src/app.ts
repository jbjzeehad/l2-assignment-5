import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import { env } from "./config/env";
import notFound from "./middleware/404NotFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./routes";
const app: Application = express();
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Parcel Delivery System" });
});
app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
