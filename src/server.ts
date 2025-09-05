/* eslint-disable no-console */
import express, { Request, Response } from "express";
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const app = express();

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB!");

    server = app.listen(envVars.PORT, () => {
      console.log(`server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Parcel Delevary System !!");
});
