import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UpdateUserProfile,
  UpdateUserProfileDTO,
} from '../../../../application/usecases/UpdateUserProfile';
import { UserRepository } from '../../../../domain/repositories/UserRepository';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private userRepository: UserRepository) {}

  @Get()
  async getProfile(@Request() req) {
    const user = await this.userRepository.findById(req.user.id);
    const { password, ...result } = user.toJSON();
    return result;
  }

  @Put()
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserProfileDTO,
  ) {
    const updateUserProfile = new UpdateUserProfile(this.userRepository);
    const user = await updateUserProfile.execute({
      userId: req.user.id,
      ...updateProfileDto,
    });
    const { password, ...result } = user.toJSON();
    return result;
  }
}
