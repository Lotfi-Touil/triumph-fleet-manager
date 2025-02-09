import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/UserRepository";

@Injectable()
export class DeleteUser {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
} 