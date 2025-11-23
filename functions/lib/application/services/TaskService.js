"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const TaskFactory_1 = require("../../domain/factories/TaskFactory");
const DomainError_1 = require("../../domain/errors/DomainError");
class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getUserTasks(email) {
        const tasks = await this.taskRepository.getByUserEmail(email);
        return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    async createTask(input) {
        const task = TaskFactory_1.TaskFactory.create(input);
        const created = await this.taskRepository.create({
            userId: task.userId,
            title: task.title,
            description: task.description,
            completed: task.completed,
        });
        return created;
    }
    async updateTask(id, props) {
        const existing = await this.taskRepository.getById(id);
        if (!existing) {
            throw new DomainError_1.NotFoundError("Task not found");
        }
        const updated = TaskFactory_1.TaskFactory.update(existing, props);
        await this.taskRepository.update(id, {
            title: updated.title,
            description: updated.description,
            completed: updated.completed,
        });
        return updated;
    }
    async deleteTask(id) {
        return this.taskRepository.delete(id);
    }
}
exports.TaskService = TaskService;
