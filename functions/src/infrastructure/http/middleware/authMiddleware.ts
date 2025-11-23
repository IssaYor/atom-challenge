import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../auth/JwtService";

export interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

export const createAuthMiddleware = (jwtService: JwtService) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = header.substring("Bearer ".length);

    try {
      const payload = jwtService.verifyToken(token);
      req.user = { email: payload.email };
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
