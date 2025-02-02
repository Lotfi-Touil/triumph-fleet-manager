import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SignupUser } from '@application/usecases/SignupUser';
import { LoginUser } from '@application/usecases/LoginUser';
import { SignupDTO } from '@domain/dtos/auth/SignupDTO';
import { LoginDTO } from '@domain/dtos/auth/LoginDTO';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUser,
    private readonly loginUseCase: LoginUser,
    @Inject('IAuthenticationService')
    private readonly authService: IAuthenticationService,
  ) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() data: SignupDTO) {
    const user = await this.signupUseCase.execute(data);
    const token = this.authService.generateToken(user.toJSON());
    return {
      user: user.toJSON(),
      token,
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() data: LoginDTO) {
    try {
      const result = await this.loginUseCase.execute(data);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Identifiants incorrects');
    }
  }
}
