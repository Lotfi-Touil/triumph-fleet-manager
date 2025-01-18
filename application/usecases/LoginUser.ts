import { User } from "../../domain/entities/User";
import { IUserRepository } from "../ports/repositories/IUserRepository";
import { IHashService } from "../ports/services/IHashService";
import { IAuthenticationService } from "../ports/services/IAuthenticationService";
import { UnauthorizedException } from "@nestjs/common";

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly authService: IAuthenticationService
  ) {}

  async execute(data: LoginUserDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await this.hashService.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const token = this.authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }
}
