import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Inject, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '@application/ports/services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '@application/ports/services/UserService';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject('UserService')
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return users.map(user => {
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
      });
    } catch (error) {
      this.logger.error(`Error getting users: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('technicians')
  async getTechnicians() {
    try {
      const technicians = await this.userService.getTechnicians();
      return technicians.map(technician => {
        const technicianJson = technician.toJSON();
        delete technicianJson.password;
        return technicianJson;
      });
    } catch (error) {
      this.logger.error(`Error getting technicians: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    try {
      await this.userService.updateUser({ id, ...updateUserDto });
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
