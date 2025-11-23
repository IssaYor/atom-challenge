import { CreateTaskData, ITaskRepository, UpdateTaskData } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";
import { db } from "../firebase/firestoreClient";

const TASKS_COLLECTION = "tasks";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toDate(value: any): Date {
  if (!value) return new Date();

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  return new Date(value);
}
export class FirestoreTaskRepository implements ITaskRepository {
  private collection = db.collection(TASKS_COLLECTION);

  async getByUserEmail(email: string): Promise<Task[]> {
    const normalized = normalizeEmail(email);

    const snapshot = await this.collection
      .where("userId", "==", normalized)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();

      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description ?? "",
        completed: data.completed ?? false,
        createdAt,
      } as Task;
    });
  }

  async create(data: CreateTaskData): Promise<Task> {
    const now = new Date();
    const docRef = this.collection.doc();

    const payload = {
      userId: normalizeEmail(data.userId),
      title: data.title,
      description: data.description ?? "",
      completed: data.completed ?? false,
      createdAt: now.toISOString(),
    };

    await docRef.set(payload);

    return {
      id: docRef.id,
      ...payload,
      createdAt: now,
    };
  }

  async update(id: string, data: UpdateTaskData): Promise<void> {
    const docRef = this.collection.doc(id);

    const updatePayload: any = {};

    if (data.title !== undefined) {
      updatePayload.title = data.title;
    }

    if (data.description !== undefined) {
      updatePayload.description = data.description;
    }

    if (data.completed !== undefined) {
      updatePayload.completed = data.completed;
    }

    if (Object.keys(updatePayload).length === 0) {
      return;
    }

    await docRef.update(updatePayload);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async getById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;

    const data = doc.data()!;

    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description ?? "",
      completed: data.completed ?? false,
      createdAt: toDate(data.createdAt),
    };
  }
}
