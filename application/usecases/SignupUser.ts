import { User, UserProps, UserRole } from "../../domain/entities/User";
import { IUserRepository } from "../ports/repositories/IUserRepository";
import { IHashService } from "../ports/services/IHashService";

export interface SignupUserDTO {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export class SignupUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(data: SignupUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const userProps: UserProps = {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || UserRole.CLIENT,
    };

    const user = new User(userProps);
    return this.userRepository.save(user);
  }
}
