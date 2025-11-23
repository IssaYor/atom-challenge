import { User } from "../entities/User";
import { ValidationError } from "../errors/DomainError";

export class UserFactory {
  static create(email: string): User {
    const normalized = email?.trim().toLowerCase();

    if (!normalized) {
      throw new ValidationError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new ValidationError("Invalid email address");
    }

    return {
      id: normalized,
      email: normalized,
      createdAt: new Date(),
    };
  }
}
