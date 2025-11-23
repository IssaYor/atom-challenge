"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const DomainError_1 = require("../errors/DomainError");
class UserFactory {
    static create(email) {
        const normalized = email?.trim().toLowerCase();
        if (!normalized) {
            throw new DomainError_1.ValidationError("Email is required");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalized)) {
            throw new DomainError_1.ValidationError("Invalid email address");
        }
        return {
            id: normalized,
            email: normalized,
            createdAt: new Date(),
        };
    }
}
exports.UserFactory = UserFactory;
