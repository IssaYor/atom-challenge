import { Task } from "../entities/Task";

export type CreateTaskData = {
  userId: string;
  title: string;
  description?: string;
  completed?: boolean;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  completed?: boolean;
};

export interface ITaskRepository {
  getByUserEmail(email: string): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(data: CreateTaskData): Promise<Task>;
  update(id: string, data: UpdateTaskData): Promise<void>;
  delete(id: string): Promise<void>;
}
