import {
  Controller,
  Get,
  UseGuards,
  Inject,
  Logger,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@domain/entities/User';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users.map((user) => {
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      });
    } catch (error) {
      this.logger.error(
        `Error getting all users: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('users/:userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: UserRole,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.updateRole(role);
    const updatedUser = await this.userRepository.save(user);
    const userJson = updatedUser.toJSON();
    delete userJson.password;
    return userJson;
  }
}
