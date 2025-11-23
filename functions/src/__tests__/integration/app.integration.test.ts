import request from "supertest";
import { createApp } from "../../infrastructure/http/app";
import { UserService } from "../../application/services/UserService";
import { TaskService } from "../../application/services/TaskService";
import { JwtService } from "../../infrastructure/auth/JwtService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import {
  ITaskRepository,
  CreateTaskData,
  UpdateTaskData,
} from "../../domain/repositories/ITaskRepository";
import { User } from "../../domain/entities/User";
import { Task } from "../../domain/entities/Task";

class InMemoryUserRepository implements IUserRepository {
  private users = new Map<string, User>();

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) ?? null;
  }

  async create(email: string): Promise<User> {
    const user: User = {
      id: email,
      email,
      createdAt: new Date(),
    };
    this.users.set(email, user);
    return user;
  }
}

class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, Task>();

  async getByUserEmail(email: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (t) => t.userId === email
    );
  }

  async getById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async create(data: CreateTaskData): Promise<Task> {
    const id = `task-${this.tasks.size + 1}`;
    const task: Task = {
      id,
      userId: data.userId,
      title: data.title,
      description: data.description ?? "",
      completed: data.completed ?? false,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async update(id: string, data: UpdateTaskData): Promise<void> {
    const existing = this.tasks.get(id);
    if (!existing) return;

    this.tasks.set(id, {
      ...existing,
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      completed: data.completed ?? existing.completed,
    });
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }
}

describe("Integration: auth + tasks", () => {
  const userRepo = new InMemoryUserRepository();
  const taskRepo = new InMemoryTaskRepository();
  const userService = new UserService(userRepo);
  const taskService = new TaskService(taskRepo);
  const jwtService = new JwtService();

  const app = createApp(userService, taskService, jwtService);

  it("should register a user, create a task and list tasks using JWT", async () => {
    const email = "integration@test.com";

    // 1) Register
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ email });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe(email);
    expect(registerRes.body.token).toBeDefined();

    const token = registerRes.body.token as string;

    // 2) Create task
    const createTaskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My first task",
        description: "Some description",
      });

    expect(createTaskRes.status).toBe(201);
    expect(createTaskRes.body.title).toBe("My first task");
    expect(createTaskRes.body.userId).toBe(email.toLowerCase());

    // 3) Get tasks
    const getTasksRes = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(getTasksRes.status).toBe(200);
    expect(Array.isArray(getTasksRes.body)).toBe(true);
    expect(getTasksRes.body.length).toBe(1);
    expect(getTasksRes.body[0].title).toBe("My first task");
  });

  it("should return 401 when accessing tasks without token", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(401);
  });
});
