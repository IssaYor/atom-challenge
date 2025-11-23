import express from "express";
import cors from "cors";
import { createTaskRouter } from "./routes/taskRoutes";
import { createAuthRouter } from "./routes/authRoutes";
import { UserService } from "../../application/services/UserService";
import { JwtService } from "../auth/JwtService";
import { createAuthMiddleware } from "./middleware/authMiddleware";
import { TaskService } from "../../application/services/TaskService";

export function createApp(
  userService: UserService,
  taskService: TaskService,
  jwtService: JwtService
) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  const authMiddleware = createAuthMiddleware(jwtService);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/auth", createAuthRouter(userService, jwtService));
  app.use("/api/tasks", authMiddleware, createTaskRouter(taskService));

  return app;
}
