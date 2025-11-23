"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DEFAULT_EXPIRATION = "1d";
class JwtService {
    constructor(secret) {
        this.secret = secret || process.env.JWT_SECRET || "dev-secret-change-me";
    }
    generateToken(email) {
        const payload = { email };
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: DEFAULT_EXPIRATION });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
}
exports.JwtService = JwtService;
