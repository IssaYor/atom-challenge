"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const taskRoutes_1 = require("./routes/taskRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const authMiddleware_1 = require("./middleware/authMiddleware");
function createApp(userService, taskService, jwtService) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    const authMiddleware = (0, authMiddleware_1.createAuthMiddleware)(jwtService);
    app.get("/api/health", (_req, res) => {
        res.json({ status: "ok" });
    });
    app.use("/api/auth", (0, authRoutes_1.createAuthRouter)(userService, jwtService));
    app.use("/api/tasks", authMiddleware, (0, taskRoutes_1.createTaskRouter)(taskService));
    return app;
}
