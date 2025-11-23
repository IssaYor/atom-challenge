import { JwtService } from "../../../infrastructure/auth/JwtService";

describe("JwtService", () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService("test-secret");
  });

  it("should generate a token as a non-empty string", () => {
    const token = jwtService.generateToken("user@test.com");

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should verify a valid token and return the payload with email", () => {
    const email = "user@test.com";
    const token = jwtService.generateToken(email);

    const payload = jwtService.verifyToken(token);
    expect(payload.email).toBe(email);
  });

  it("should throw an error when verifying an invalid token", () => {
    const invalidToken = "this.is.not.a.valid.token";

    expect(() => jwtService.verifyToken(invalidToken)).toThrow();
  });
});