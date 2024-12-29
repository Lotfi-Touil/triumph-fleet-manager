import { UserRole } from '../../users/entities/user.entity';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
