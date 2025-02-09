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
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@domain/entities/User';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('users')
  async getAllUsers(@Request() req) {
    try {
      const users = await this.userRepository.findAll();
      let filteredUsers = users.map((user) => {
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      });

      // si l'utilisateur est un concessionnaire, on affiche pas les comptes admin
      if (req.user.role !== UserRole.ADMIN) {
        filteredUsers = filteredUsers.filter(user => user.role !== UserRole.ADMIN);
      }

      return filteredUsers;
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
    @Request() req,
    @Param('userId') userId: string,
    @Body('role') newRole: UserRole,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (req.user.role !== UserRole.ADMIN) {
      if (user.role === UserRole.ADMIN) {
        throw new ForbiddenException('Ne peut pas modifier un compte admin');
      }
      if (newRole === UserRole.ADMIN) {
        throw new ForbiddenException('Ne peut pas promouvoir en admin');
      }
    }

    user.updateRole(newRole);
    const updatedUser = await this.userRepository.save(user);
    const userJson = updatedUser.toJSON();
    delete userJson.password;
    return userJson;
  }
}
