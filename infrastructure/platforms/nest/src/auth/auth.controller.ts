import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUser, LoginResponse } from './interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
  ): Promise<LoginResponse> {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthUser> {
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): AuthUser {
    return req.user;
  }
}
