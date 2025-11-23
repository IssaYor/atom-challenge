import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";
import { TaskFactory } from "../../domain/factories/TaskFactory";
import { NotFoundError } from "../../domain/errors/DomainError";

export class TaskService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async getUserTasks(email: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getByUserEmail(email);
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTask(input: { userEmail: string; title: string; description?: string }): Promise<Task> {
    const task = TaskFactory.create(input);

    const created = await this.taskRepository.create({
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
    });

    return created;
  }

  async updateTask(
    id: string,
    props: { title?: string; description?: string; completed?: boolean }
  ): Promise<Task> {
    const existing = await this.taskRepository.getById(id);

    if (!existing) {
      throw new NotFoundError("Task not found");
    }

    const updated = TaskFactory.update(existing, props);

    await this.taskRepository.update(id, {
      title: updated.title,
      description: updated.description,
      completed: updated.completed,
    });

    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    return this.taskRepository.delete(id);
  }
}
