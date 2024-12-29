import { User, UserProps, UserRole } from "../../../../domain/entities/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { HashService } from "../../services/HashService";

export interface SignupDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export class SignupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(dto: SignupDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.hashService.hash(dto.password);

    const userProps: UserProps = {
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role || UserRole.CLIENT,
    };

    const user = new User(userProps);
    return this.userRepository.save(user);
  }
}
