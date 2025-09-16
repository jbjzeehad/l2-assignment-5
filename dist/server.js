"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const starterAdmin_1 = __importDefault(require("./utils/starterAdmin"));
let server;
const exitSignals = [
    "SIGINT",
    "SIGTERM",
    "uncaughtException",
    "unhandledRejection",
];
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Server is starting");
        server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Server is running on ${env_1.env.PORT}`);
        });
        console.log("Server started");
        console.log("Connecting to database");
        yield mongoose_1.default.connect(env_1.env.DB_URL);
        console.log("Database connected");
    }
    catch (error) {
        console.log(error);
    }
});
function signalHandler(err) {
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, starterAdmin_1.default)();
}))();
