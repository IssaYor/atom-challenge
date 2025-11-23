import { UserService } from "../../application/services/UserService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { ValidationError } from "../../domain/errors/DomainError";

describe("UserService", () => {
  let repo: jest.Mocked<IUserRepository>;
  let service: UserService;

  const baseUser: User = {
    id: "user@test.com",
    email: "user@test.com",
    createdAt: new Date("2025-01-01T10:00:00Z"),
  };

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    service = new UserService(repo);
  });

  // ─────────────────────────────
  // findByEmail
  // ─────────────────────────────
  describe("findByEmail", () => {
    it("should return user when repository finds one", async () => {
      repo.findByEmail.mockResolvedValue(baseUser);

      const result = await service.findByEmail("user@test.com");

      expect(repo.findByEmail).toHaveBeenCalledWith("user@test.com");
      expect(result).toEqual(baseUser);
    });

    it("should return null when repository returns null", async () => {
      repo.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail("unknown@test.com");

      expect(repo.findByEmail).toHaveBeenCalledWith("unknown@test.com");
      expect(result).toBeNull();
    });
  });

  // ─────────────────────────────
  // create
  // ─────────────────────────────
  describe("create", () => {
    it("should create user with normalized email", async () => {
      repo.create.mockImplementation(async (email: string): Promise<User> => ({
        id: email,
        email,
        createdAt: new Date("2025-01-02T10:00:00Z"),
      }));

      const result = await service.create("  User@Test.com  ");

      expect(repo.create).toHaveBeenCalledWith("user@test.com");
      expect(result.email).toBe("user@test.com");
      expect(result.id).toBe("user@test.com");
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it("should throw ValidationError when email is empty", async () => {
      await expect(service.create("   ")).rejects.toBeInstanceOf(
        ValidationError
      );

      expect(repo.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when email is invalid", async () => {
      await expect(service.create("not-an-email")).rejects.toBeInstanceOf(
        ValidationError
      );

      expect(repo.create).not.toHaveBeenCalled();
    });
  });
});
