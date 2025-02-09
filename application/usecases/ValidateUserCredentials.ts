import { Injectable, Inject } from "@nestjs/common";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import * as bcrypt from "bcrypt";

@Injectable()
export class ValidateUserCredentials {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to validate user credentials: ${error.message}`);
    }
  }
} 