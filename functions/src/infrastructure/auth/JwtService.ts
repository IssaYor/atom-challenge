import jwt from "jsonwebtoken";

export interface JwtPayload {
  email: string;
}

const DEFAULT_EXPIRATION = "1d";

export class JwtService {
  private readonly secret: string;

  constructor(secret?: string) {
    this.secret = secret || process.env.JWT_SECRET || "dev-secret-change-me";
  }

  generateToken(email: string): string {
    const payload: JwtPayload = { email };
    return jwt.sign(payload, this.secret, { expiresIn: DEFAULT_EXPIRATION });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
