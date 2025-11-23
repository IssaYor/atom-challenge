"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
// functions/src/index.ts
const functions = __importStar(require("firebase-functions"));
const app_1 = require("./infrastructure/http/app");
const FirestoreUserRepository_1 = require("./infrastructure/repositories/FirestoreUserRepository");
const FirestoreTaskRepository_1 = require("./infrastructure/repositories/FirestoreTaskRepository");
const UserService_1 = require("./application/services/UserService");
const TaskService_1 = require("./application/services/TaskService");
const JwtService_1 = require("./infrastructure/auth/JwtService");
const userRepo = new FirestoreUserRepository_1.FirestoreUserRepository();
const taskRepo = new FirestoreTaskRepository_1.FirestoreTaskRepository();
const userService = new UserService_1.UserService(userRepo);
const taskService = new TaskService_1.TaskService(taskRepo);
const jwtService = new JwtService_1.JwtService();
const app = (0, app_1.createApp)(userService, taskService, jwtService);
exports.api = functions.https.onRequest(app);
