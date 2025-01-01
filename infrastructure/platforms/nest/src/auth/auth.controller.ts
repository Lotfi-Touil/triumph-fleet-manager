import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupUser } from '@application/usecases/SignupUser';
import { LoginUser } from '@application/usecases/LoginUser';
import { SignupDTO } from '@domain/dtos/auth/SignupDTO';
import { LoginDTO } from '@domain/dtos/auth/LoginDTO';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUser,
    private readonly loginUseCase: LoginUser,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() data: SignupDTO) {
    const user = await this.signupUseCase.execute(data);
    return user.toJSON();
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() data: LoginDTO) {
    return this.loginUseCase.execute(data);
  }
}
