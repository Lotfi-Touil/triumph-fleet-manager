import { User } from "../../../../domain/entities/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { HashService } from "../../services/HashService";
import { TokenService } from "../../services/TokenService";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await this.hashService.compare(
      dto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = await this.tokenService.generate({
      id: user.id!,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
    };
  }
}
