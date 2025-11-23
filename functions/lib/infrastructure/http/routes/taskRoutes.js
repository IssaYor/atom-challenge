"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskRouter = createTaskRouter;
const express_1 = require("express");
const DomainError_1 = require("../../../domain/errors/DomainError");
function createTaskRouter(taskService) {
    const router = (0, express_1.Router)();
    // GET /api/tasks
    router.get("/", async (req, res) => {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const tasks = await taskService.getUserTasks(email);
            return res.json(tasks);
        }
        catch (error) {
            console.error("Error getting tasks", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    // POST /api/tasks
    router.post("/", async (req, res) => {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { title, description } = req.body;
            const task = await taskService.createTask({
                userEmail: email,
                title,
                description,
            });
            return res.status(201).json(task);
        }
        catch (error) {
            console.error("Error creating task", error);
            if (error instanceof DomainError_1.ValidationError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    // PUT /api/tasks/:id
    router.put("/:id", async (req, res) => {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const id = req.params.id;
            const { title, description, completed } = req.body;
            const task = await taskService.updateTask(id, {
                title,
                description,
                completed,
            });
            return res.json(task);
        }
        catch (error) {
            console.error("Error updating task", error);
            if (error instanceof DomainError_1.ValidationError) {
                return res.status(400).json({ message: error.message });
            }
            if (error instanceof DomainError_1.NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    // DELETE /api/tasks/:id
    router.delete("/:id", async (req, res) => {
        try {
            const email = req.user?.email;
            if (!email) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const id = req.params.id;
            await taskService.deleteTask(id);
            return res.status(204).send();
        }
        catch (error) {
            console.error("Error deleting task", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    return router;
}
