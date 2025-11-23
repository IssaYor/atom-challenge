"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const DomainError_1 = require("../../../domain/errors/DomainError");
function createAuthRouter(userService, jwtService) {
    const router = (0, express_1.Router)();
    router.post("/login", async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userService.findByEmail(email);
            if (!user) {
                return res.status(404).json({ exists: false });
            }
            const token = jwtService.generateToken(user.email);
            return res.json({
                exists: true,
                user,
                token,
            });
        }
        catch (error) {
            console.error("Login error", error);
            if (error instanceof DomainError_1.ValidationError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    router.post("/register", async (req, res) => {
        const { email } = req.body;
        try {
            const user = await userService.create(email);
            const token = jwtService.generateToken(user.email);
            return res.status(201).json({
                user,
                token,
            });
        }
        catch (error) {
            console.error("Register error", error);
            if (error instanceof DomainError_1.ValidationError) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    return router;
}
