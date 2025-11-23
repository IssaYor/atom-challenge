import jwt from "jsonwebtoken";
import * as functions from "firebase-functions";

export interface JwtPayload {
  email: string;
}

const DEFAULT_EXPIRATION = "1d";

export class JwtService {
  private readonly secretHint: string;

  constructor(secret?: string) {
    this.secretHint = secret || process.env.JWT_SECRET || "";
  }

  private resolveSecret(): string {
    const fromEnv = this.secretHint || process.env.JWT_SECRET;
    const fromConfig = (() => {
      try {
        const cfg = functions.config?.();
        return cfg?.jwt?.secret as string | undefined;
      } catch {
        return undefined;
      }
    })();

    const secret = fromEnv || fromConfig;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return secret;
  }

  generateToken(email: string): string {
    const payload: JwtPayload = { email };
    const secret = this.resolveSecret();

    return jwt.sign(payload, secret, { expiresIn: DEFAULT_EXPIRATION });
  }

  verifyToken(token: string): JwtPayload {
    const secret = this.resolveSecret();
    return jwt.verify(token, secret) as JwtPayload;
  }
}
