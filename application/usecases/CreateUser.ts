import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { User, UserRole } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import * as bcrypt from "bcrypt";

export interface CreateUserDTO {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable()
export class CreateUser {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(dto: CreateUserDTO): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new User({
      id: dto.id,
      email: dto.email,
      password: hashedPassword,
      name: `${dto.firstName} ${dto.lastName}`,
      role: dto.role as UserRole,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
} 