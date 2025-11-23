import { TaskService } from "../../application/services/TaskService";
import {
  ITaskRepository,
  CreateTaskData,
} from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";
import {
  ValidationError,
  NotFoundError,
} from "../../domain/errors/DomainError";

describe("TaskService", () => {
  let repo: jest.Mocked<ITaskRepository>;
  let service: TaskService;

  const baseTask: Task = {
    id: "task-1",
    userId: "user@test.com",
    title: "Original title",
    description: "Original description",
    completed: false,
    createdAt: new Date("2025-01-01T10:00:00Z"),
  };

  beforeEach(() => {
    repo = {
      getByUserEmail: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new TaskService(repo);
  });

  // ─────────────────────────────
  // getUserTasks
  // ─────────────────────────────
  describe("getUserTasks", () => {
    it("should return tasks sorted by createdAt desc", async () => {
      const oldest: Task = {
        ...baseTask,
        id: "t1",
        createdAt: new Date("2025-01-01T10:00:00Z"),
      };

      const middle: Task = {
        ...baseTask,
        id: "t2",
        createdAt: new Date("2025-01-02T10:00:00Z"),
      };

      const newest: Task = {
        ...baseTask,
        id: "t3",
        createdAt: new Date("2025-01-03T10:00:00Z"),
      };

      repo.getByUserEmail.mockResolvedValue([oldest, newest, middle]);

      const result = await service.getUserTasks("user@test.com");

      expect(repo.getByUserEmail).toHaveBeenCalledWith("user@test.com");
      expect(result.map((t) => t.id)).toEqual(["t3", "t2", "t1"]);
    });

    it("should return empty array when user has no tasks", async () => {
      repo.getByUserEmail.mockResolvedValue([]);

      const result = await service.getUserTasks("user@test.com");

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────
  // createTask
  // ─────────────────────────────
  describe("createTask", () => {
    it("should create a task with normalized userEmail and default values", async () => {
      const created: Task = {
        id: "task-created",
        userId: "user@test.com",
        title: "My task",
        description: "",
        completed: false,
        createdAt: new Date(),
      };

      repo.create.mockImplementation(
        async (data: CreateTaskData): Promise<Task> => ({
          id: "task-created",
          userId: data.userId,
          title: data.title,
          description: data.description ?? "",
          completed: data.completed ?? false,
          createdAt: new Date(),
        })
      );

      const result = await service.createTask({
        userEmail: "  User@Test.com  ",
        title: "  My task  ",
        // description opcional
      });

      expect(repo.create).toHaveBeenCalledWith({
        userId: "user@test.com", // normalizado
        title: "My task",        // trim
        description: "",
        completed: false,
      });

      expect(result.id).toBe("task-created");
      expect(result.userId).toBe("user@test.com");
      expect(result.title).toBe("My task");
      expect(result.description).toBe("");
      expect(result.completed).toBe(false);
    });

    it("should throw ValidationError when title is empty", async () => {
      await expect(
        service.createTask({
          userEmail: "user@test.com",
          title: "   ", // vacío tras trim
          description: "desc",
        })
      ).rejects.toBeInstanceOf(ValidationError);

      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────
  // updateTask
  // ─────────────────────────────
  describe("updateTask", () => {
    it("should throw NotFoundError if task does not exist", async () => {
      repo.getById.mockResolvedValue(null);

      await expect(
        service.updateTask("non-existing", { title: "New title" })
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(repo.getById).toHaveBeenCalledWith("non-existing");
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("should throw ValidationError if new title is empty", async () => {
      repo.getById.mockResolvedValue(baseTask);

      await expect(
        service.updateTask("task-1", { title: "   " })
      ).rejects.toBeInstanceOf(ValidationError);

      expect(repo.update).not.toHaveBeenCalled();
    });

    it("should update only provided fields and return updated task", async () => {
      repo.getById.mockResolvedValue(baseTask);
      repo.update.mockResolvedValue();

      const result = await service.updateTask("task-1", {
        title: "Updated title",
        completed: true,
      });

      // Verificamos llamada al repo
      expect(repo.update).toHaveBeenCalledWith("task-1", {
        title: "Updated title",
        description: baseTask.description,
        completed: true,
      });

      // Verificamos entidad retornada por el servicio
      expect(result.id).toBe("task-1");
      expect(result.title).toBe("Updated title");
      expect(result.completed).toBe(true);
      expect(result.description).toBe(baseTask.description);
      expect(result.createdAt).toEqual(baseTask.createdAt);
    });

    it("should allow updating description only", async () => {
      repo.getById.mockResolvedValue(baseTask);
      repo.update.mockResolvedValue();

      const result = await service.updateTask("task-1", {
        description: "New description",
      });

      expect(repo.update).toHaveBeenCalledWith("task-1", {
        title: baseTask.title,
        description: "New description",
        completed: baseTask.completed,
      });

      expect(result.description).toBe("New description");
      expect(result.title).toBe(baseTask.title);
      expect(result.completed).toBe(baseTask.completed);
    });
  });

  // ─────────────────────────────
  // deleteTask
  // ─────────────────────────────
  describe("deleteTask", () => {
    it("should call repository delete with correct id", async () => {
      repo.delete.mockResolvedValue();

      await service.deleteTask("task-1");

      expect(repo.delete).toHaveBeenCalledWith("task-1");
    });
  });
});
