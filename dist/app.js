"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const _404NotFound_1 = __importDefault(require("./middleware/404NotFound"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({ message: "Parcel Delivery System" });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHandler_1.default);
app.use(_404NotFound_1.default);
exports.default = app;
