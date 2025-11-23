import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserFactory } from "../../domain/factories/UserFactory";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(email: string): Promise<User> {
    const user = UserFactory.create(email);

    return this.userRepository.create(user.email);
  }
}
