import { Injectable, Inject, NotFoundException, ConflictException } from "@nestjs/common";
import { User, UserRole } from "../../domain/entities/User";
import { UserRepository } from "../ports/repositories/UserRepository";
import * as bcrypt from "bcrypt";

export interface UpdateUserDTO {
  id: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable()
export class UpdateUser {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(dto: UpdateUserDTO): Promise<void> {
    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException("Email already in use");
      }
    }

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user.updatePassword(hashedPassword);
    }

    if (dto.role) {
      user.updateRole(dto.role as UserRole);
    }

    if (dto.email || dto.firstName || dto.lastName) {
      const name = dto.firstName || dto.lastName 
        ? `${dto.firstName || user.name.split(' ')[0]} ${dto.lastName || user.name.split(' ')[1]}`
        : user.name;
      user.updateProfile(name, dto.email || user.email);
    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
} 