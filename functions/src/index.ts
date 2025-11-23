// functions/src/index.ts
import "dotenv/config";
import * as functions from "firebase-functions";
import { createApp } from "./infrastructure/http/app";

import { FirestoreUserRepository } from "./infrastructure/repositories/FirestoreUserRepository";
import { FirestoreTaskRepository } from "./infrastructure/repositories/FirestoreTaskRepository";
import { UserService } from "./application/services/UserService";
import { TaskService } from "./application/services/TaskService";
import { JwtService } from "./infrastructure/auth/JwtService";

const userRepo = new FirestoreUserRepository();
const taskRepo = new FirestoreTaskRepository();

const userService = new UserService(userRepo);
const taskService = new TaskService(taskRepo);
const jwtService = new JwtService();

const app = createApp(userService, taskService, jwtService);

export const api = functions
  .runWith({
    secrets: ["JWT_SECRET"],
  })
  .https.onRequest(app);
