import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";
import starterAdmin from "./utils/starterAdmin";
let server: Server;
type ExitSignals =
  | "SIGINT"
  | "SIGTERM"
  | "uncaughtException"
  | "unhandledRejection";
const exitSignals: ExitSignals[] = [
  "SIGINT",
  "SIGTERM",
  "uncaughtException",
  "unhandledRejection",
];
const startServer = async () => {
  try {
    console.log("Server is starting");
    server = app.listen(env.PORT, () => {
      console.log(`Server is running on ${env.PORT}`);
    });
    console.log("Server started");
    console.log("Connecting to database");
    await mongoose.connect(env.DB_URL);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};
function signalHandler(err: ExitSignals) {
  process.on(err, (error) => {
    console.log(`${err} detected ..... server shutting down`, error);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });
}
exitSignals.forEach(signalHandler);
(async () => {
  await startServer();
  await starterAdmin();
})();
