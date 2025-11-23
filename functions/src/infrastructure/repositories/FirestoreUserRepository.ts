import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { db } from "../firebase/firestoreClient";

const USERS_COLLECTION = "users";

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

export class FirestoreUserRepository implements IUserRepository {
  private collection = db.collection(USERS_COLLECTION);

  async findByEmail(email: string): Promise<User | null> {
    const normalized = normalizeEmail(email);
    const doc = await this.collection.doc(normalized).get();

    if (!doc.exists) return null;

    const data = doc.data()!;

    const createdAt = toDate(data.createdAt);

    return {
      id: doc.id,
      email: data.email,
      createdAt,
    };
  }

  async create(email: string): Promise<User> {
    const normalized = normalizeEmail(email);
    const docRef = this.collection.doc(normalized);

    const now = new Date();

    await docRef.set({
      email: normalized,
      createdAt: now.toISOString(),
    });

    return {
      id: docRef.id,
      email: normalized,
      createdAt: now,
    };
  }
}
