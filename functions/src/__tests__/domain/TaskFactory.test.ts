import { TaskFactory } from "../../domain/factories/TaskFactory";
import { Task } from "../../domain/entities/Task";
import { ValidationError } from "../../domain/errors/DomainError";

describe("TaskFactory", () => {
  const baseTask: Task = {
    id: "task-1",
    userId: "user@test.com",
    title: "Original title",
    description: "Original description",
    completed: false,
    createdAt: new Date("2025-01-01T10:00:00Z"),
  };

  // ─────────────────────────────
  // create
  // ─────────────────────────────
  describe("create", () => {
    it("should create a task with normalized email and trimmed title/description", () => {
      const task = TaskFactory.create({
        userEmail: "  User@Test.com  ",
        title: "  My task  ",
        description: "  Some description  ",
      });

      expect(task.id).toBe("");
      expect(task.userId).toBe("user@test.com");
      expect(task.title).toBe("My task");
      expect(task.description).toBe("Some description");
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it("should set empty description when not provided", () => {
      const task = TaskFactory.create({
        userEmail: "user@test.com",
        title: "Title",
      });

      expect(task.description).toBe("");
    });

    it("should throw ValidationError when title is empty or whitespace", () => {
      expect(() =>
        TaskFactory.create({
          userEmail: "user@test.com",
          title: "   ",
        })
      ).toThrow(ValidationError);

      expect(() =>
        TaskFactory.create({
          userEmail: "user@test.com",
          // @ts-expect-error
          title: undefined,
        })
      ).toThrow(ValidationError);
    });
  });

  // ─────────────────────────────
  // update
  // ─────────────────────────────
  describe("update", () => {
    it("should keep original values when no props are provided", () => {
      const updated = TaskFactory.update(baseTask, {});

      expect(updated).toEqual(baseTask);
    });

    it("should update title when provided and trimmed", () => {
      const updated = TaskFactory.update(baseTask, {
        title: "  New title  ",
      });

      expect(updated.title).toBe("New title");
      expect(updated.description).toBe(baseTask.description);
      expect(updated.completed).toBe(baseTask.completed);
    });

    it("should throw ValidationError if new title is empty or whitespace", () => {
      expect(() =>
        TaskFactory.update(baseTask, { title: "   " })
      ).toThrow(ValidationError);
    });

    it("should update description when provided", () => {
      const updated = TaskFactory.update(baseTask, {
        description: "  New description  ",
      });

      expect(updated.description).toBe("New description");
      expect(updated.title).toBe(baseTask.title);
      expect(updated.completed).toBe(baseTask.completed);
    });

    it("should update completed when provided", () => {
      const updated = TaskFactory.update(baseTask, {
        completed: true,
      });

      expect(updated.completed).toBe(true);
      expect(updated.title).toBe(baseTask.title);
      expect(updated.description).toBe(baseTask.description);
    });

    it("should update multiple fields together", () => {
      const updated = TaskFactory.update(baseTask, {
        title: "  New title  ",
        description: "  New desc  ",
        completed: true,
      });

      expect(updated.title).toBe("New title");
      expect(updated.description).toBe("New desc");
      expect(updated.completed).toBe(true);
    });
  });
});
