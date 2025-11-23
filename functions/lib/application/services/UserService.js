"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserFactory_1 = require("../../domain/factories/UserFactory");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async create(email) {
        const user = UserFactory_1.UserFactory.create(email);
        return this.userRepository.create(user.email);
    }
}
exports.UserService = UserService;
