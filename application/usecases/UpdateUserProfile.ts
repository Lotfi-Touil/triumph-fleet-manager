import {
  Injectable,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import * as bcrypt from "bcrypt";

export interface UpdateUserProfileDTO {
  userId: string;
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

@Injectable()
export class UpdateUserProfile {
  constructor(
    @Inject("UserRepository")
    private userRepository: UserRepository
  ) {}

  async execute(dto: UpdateUserProfileDTO): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new UnauthorizedException("Email already in use");
      }
    }

    if (dto.currentPassword && dto.newPassword) {
      const isPasswordValid = await bcrypt.compare(
        dto.currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
      user.updatePassword(hashedPassword);
    }

    if (dto.name || dto.email) {
      user.updateProfile(dto.name || user.name, dto.email || user.email);
    }

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }
}
