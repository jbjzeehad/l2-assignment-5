/* eslint-disable no-console */
import express from "express";
import { Server } from "http";
import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const app = express();

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tour-db:tourdb@tour.nemxwwb.mongodb.net/pdsystem?retryWrites=true&w=majority&appName=tour"
    );

    console.log("Connected to DB!");

    server = app.listen(5000, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
