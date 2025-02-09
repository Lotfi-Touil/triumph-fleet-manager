import { Injectable, Inject } from '@nestjs/common';
import {
  UserService,
  CreateUserDTO,
  UpdateUserDTO,
} from '@application/ports/services/UserService';
import { User, UserRole } from '@domain/entities/User';
import { CreateUser } from '@application/usecases/CreateUser';
import { UpdateUser } from '@application/usecases/UpdateUser';
import { DeleteUser } from '@application/usecases/DeleteUser';
import { GetUsers } from '@application/usecases/GetUsers';
import { ValidateUserCredentials } from '@application/usecases/ValidateUserCredentials';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { randomUUID } from 'crypto';

@Injectable()
export class NestUserService implements UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(CreateUser)
    private readonly createUserUseCase: CreateUser,
    @Inject(UpdateUser)
    private readonly updateUserUseCase: UpdateUser,
    @Inject(DeleteUser)
    private readonly deleteUserUseCase: DeleteUser,
    @Inject(GetUsers)
    private readonly getUsersUseCase: GetUsers,
    @Inject(ValidateUserCredentials)
    private readonly validateUserCredentialsUseCase: ValidateUserCredentials,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<string> {
    const userId = randomUUID();
    await this.createUserUseCase.execute({
      id: userId,
      ...dto,
    });
    return userId;
  }

  async updateUser(dto: UpdateUserDTO): Promise<void> {
    await this.updateUserUseCase.execute(dto);
  }

  async deleteUser(id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.getUsersUseCase.execute();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getTechnicians(): Promise<User[]> {
    const users = await this.getAllUsers();
    return users.filter((user) => user.role === UserRole.TECHNICIAN);
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    return this.validateUserCredentialsUseCase.execute(email, password);
  }
} 