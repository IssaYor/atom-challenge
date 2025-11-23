"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = require("express");
const UserService_1 = require("../../../application/services/UserService");
function createUserRouter(userRepository) {
    const router = (0, express_1.Router)();
    const userService = new UserService_1.UserService(userRepository);
    // GET /api/users/:email
    router.get("/:email", async (req, res) => {
        try {
            const email = req.params.email;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const user = await userService.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    // POST /api/users
    router.post("/", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            const user = await userService.create(email);
            return res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
    return router;
}
