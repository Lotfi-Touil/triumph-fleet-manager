import { User, UserRole } from '@domain/entities/User';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  id: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface UserService {
  createUser(dto: CreateUserDTO): Promise<string>;
  updateUser(dto: UpdateUserDTO): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getTechnicians(): Promise<User[]>;
  validateUserCredentials(email: string, password: string): Promise<User | null>;
} 