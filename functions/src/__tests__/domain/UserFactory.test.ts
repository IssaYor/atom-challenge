import { UserFactory } from "../../domain/factories/UserFactory";
import { ValidationError } from "../../domain/errors/DomainError";

describe("UserFactory", () => {
  it("should create a user with normalized email", () => {
    const user = UserFactory.create("  TEST@Mail.Com  ");

    expect(user.email).toBe("test@mail.com");
    expect(user.id).toBe("test@mail.com");
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("should throw ValidationError if email is empty", () => {
    expect(() => UserFactory.create("  ")).toThrow(ValidationError);
  });

  it("should throw ValidationError if email is invalid", () => {
    expect(() => UserFactory.create("not-an-email")).toThrow(ValidationError);
  });
});
