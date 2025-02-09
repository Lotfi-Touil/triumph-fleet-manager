import { Injectable, Inject } from "@nestjs/common";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../ports/repositories/UserRepository";

@Injectable()
export class GetUsers {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }
} 