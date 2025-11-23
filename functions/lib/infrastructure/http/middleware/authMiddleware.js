"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = void 0;
const createAuthMiddleware = (jwtService) => (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }
    const token = header.substring("Bearer ".length);
    try {
        const payload = jwtService.verifyToken(token);
        req.user = { email: payload.email };
        next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.createAuthMiddleware = createAuthMiddleware;
