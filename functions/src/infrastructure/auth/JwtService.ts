import jwt from "jsonwebtoken";
import "dotenv/config";

export interface JwtPayload {
  email: string;
}

const DEFAULT_EXPIRATION = "1d";

export class JwtService {
  private readonly secret: string;

  constructor(secret?: string) {
    this.secret =
      secret ||
      process.env.JWT_SECRET ||
      (() => {
        throw new Error("JWT_SECRET is not defined");
      })();
  }

  generateToken(email: string): string {
    const payload: JwtPayload = { email };
    return jwt.sign(payload, this.secret, { expiresIn: DEFAULT_EXPIRATION });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
