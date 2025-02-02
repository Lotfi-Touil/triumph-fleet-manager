import { Controller, Get, UseGuards, Inject, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '@domain/entities/User';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  @Get('technicians')
  async getTechnicians() {
    try {
      const users = await this.userRepository.findAll();
      const technicians = users.filter(
        (user) => user.role === UserRole.TECHNICIAN,
      );
      return technicians.map((technician) => {
        const technicianJson = technician.toJSON();
        delete technicianJson.password;
        return technicianJson;
      });
    } catch (error) {
      this.logger.error(
        `Error getting technicians: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
