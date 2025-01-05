import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";

export interface UpdateUserProfileDTO {
  userId: string;
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UpdateUserProfile {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: UpdateUserProfileDTO): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (dto.currentPassword && dto.newPassword) {
      if (user.password !== dto.currentPassword) {
        throw new Error("Current password is incorrect");
      }
      user.updatePassword(dto.newPassword);
    }

    if (dto.name) {
      user.props.name = dto.name;
    }

    if (dto.email) {
      user.props.email = dto.email;
    }

    user.props.updatedAt = new Date();

    return this.userRepository.save(user);
  }
}
