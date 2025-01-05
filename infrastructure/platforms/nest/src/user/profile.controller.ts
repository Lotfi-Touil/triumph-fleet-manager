import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UpdateUserProfile,
  UpdateUserProfileDTO,
} from '../../../../../application/usecases/UpdateUserProfile';
import { UserRepository } from '../../../../../domain/repositories/UserRepository';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    private updateUserProfile: UpdateUserProfile,
  ) {}

  @Get()
  async getProfile(@Request() req) {
    try {
      this.logger.debug('Request object:', JSON.stringify(req.user));

      if (!req.user || !req.user.id) {
        this.logger.error('User object in request:', req.user);
        throw new InternalServerErrorException('User ID not found in request');
      }

      this.logger.debug(`Attempting to find user with ID: ${req.user.id}`);
      const user = await this.userRepository.findById(req.user.id);

      if (!user) {
        this.logger.warn(`No user found with ID: ${req.user.id}`);
        throw new NotFoundException('User not found');
      }

      this.logger.debug('User found:', JSON.stringify(user));
      const userJson = user.toJSON();
      delete userJson.password;
      return userJson;
    } catch (error) {
      this.logger.error(`Error in getProfile: ${error.message}`, error.stack, {
        userId: req.user?.id,
        error: error.toString(),
        stack: error.stack,
      });
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get user profile');
    }
  }

  @Put()
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserProfileDTO,
  ) {
    try {
      if (!req.user || !req.user.id) {
        this.logger.error('User object in request:', req.user);
        throw new InternalServerErrorException('User ID not found in request');
      }

      const user = await this.updateUserProfile.execute({
        userId: req.user.id,
        ...updateProfileDto,
      });
      const userJson = user.toJSON();
      delete userJson.password;
      return userJson;
    } catch (error) {
      this.logger.error(
        `Error in updateProfile: ${error.message}`,
        error.stack,
        {
          userId: req.user?.id,
          error: error.toString(),
          stack: error.stack,
        },
      );
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
}
