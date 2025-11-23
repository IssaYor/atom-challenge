import { Task } from "../entities/Task";
import { ValidationError } from "../errors/DomainError";

interface CreateTaskProps {
  userEmail: string;
  title: string;
  description?: string;
}

interface UpdateTaskProps {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TaskFactory {
  static create(props: CreateTaskProps): Task {
    const now = new Date();

    const title = props.title?.trim();
    if (!title) {
      throw new ValidationError("Title cannot be empty");
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

  static update(task: Task, props: UpdateTaskProps): Task {
    let title = task.title;

    if (props.title !== undefined) {
      const trimmed = props.title.trim();
      if (!trimmed) {
        throw new ValidationError("Title cannot be empty");
      }
      title = trimmed;
    }

    const description =
      props.description !== undefined
        ? props.description.trim()
        : task.description;

    const completed =
      props.completed !== undefined
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
