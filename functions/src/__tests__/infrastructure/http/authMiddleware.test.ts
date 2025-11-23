import {
    createAuthMiddleware,
    AuthenticatedRequest,
  } from "../../../infrastructure/http/middleware/authMiddleware";
  import { JwtService } from "../../../infrastructure/auth/JwtService";
  import { Response, NextFunction } from "express";
  
  describe("authMiddleware", () => {
    let jwtService: jest.Mocked<JwtService>;
    let middleware: ReturnType<typeof createAuthMiddleware>;
    let res: Partial<Response>;
    let next: NextFunction;
  
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
  
    beforeEach(() => {
      jwtService = {
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
      } as any;
  
      middleware = createAuthMiddleware(jwtService);
  
      statusMock = jest.fn().mockReturnThis();
      jsonMock = jest.fn().mockReturnThis();
  
      res = {
        status: statusMock,
        json: jsonMock,
      } as any;
  
      next = jest.fn();
    });
  
    function makeReq(headers: Record<string, string>): AuthenticatedRequest {
      return {
        headers,
      } as any;
    }
  
    it("should return 401 if Authorization header is missing", async () => {
      const req = makeReq({});
  
      await middleware(req, res as Response, next);
  
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Missing or invalid Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    it("should return 401 if Authorization header does not start with Bearer", async () => {
      const req = makeReq({ authorization: "Token abc123" });
  
      await middleware(req, res as Response, next);
  
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Missing or invalid Authorization header",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    it("should return 401 if token is invalid", async () => {
      const req = makeReq({ authorization: "Bearer invalid.token.here" });
  
      jwtService.verifyToken.mockImplementation(() => {
        throw new Error("invalid token");
      });
  
      await middleware(req, res as Response, next);
  
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
      expect(next).not.toHaveBeenCalled();
    });
  
    it("should attach user to request and call next on valid token", async () => {
      const req = makeReq({ authorization: "Bearer valid.token" });
  
      jwtService.verifyToken.mockReturnValue({
        email: "user@test.com",
      } as any);
  
      await middleware(req, res as Response, next);
  
      expect(jwtService.verifyToken).toHaveBeenCalledWith("valid.token");
      expect((req as any).user).toEqual({ email: "user@test.com" });
      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });
  