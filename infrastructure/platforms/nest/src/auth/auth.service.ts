import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthUser, LoginResponse } from './interfaces/auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pass, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: AuthUser): Promise<LoginResponse> {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthUser> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const user = await this.usersService.create({
      email,
      password,
      name,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = user;
    return result;
  }
}
