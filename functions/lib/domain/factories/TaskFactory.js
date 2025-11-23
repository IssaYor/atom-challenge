"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
const DomainError_1 = require("../errors/DomainError");
class TaskFactory {
    static create(props) {
        const now = new Date();
        const title = props.title?.trim();
        if (!title) {
            throw new DomainError_1.ValidationError("Title cannot be empty");
        }
        return {
            id: "",
            userId: props.userEmail.trim().toLowerCase(),
            title,
            description: props.description?.trim() ?? "",
            completed: false,
            createdAt: now,
        };
    }
    static update(task, props) {
        let title = task.title;
        if (props.title !== undefined) {
            const trimmed = props.title.trim();
            if (!trimmed) {
                throw new DomainError_1.ValidationError("Title cannot be empty");
            }
            title = trimmed;
        }
        const description = props.description !== undefined
            ? props.description.trim()
            : task.description;
        const completed = props.completed !== undefined
            ? props.completed
            : task.completed;
        return {
            ...task,
            title,
            description,
            completed,
        };
    }
}
exports.TaskFactory = TaskFactory;
