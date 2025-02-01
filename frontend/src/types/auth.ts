export enum UserRole {
  ADMIN = 'admin',
  FLEET_MANAGER = 'fleet_manager',
  CLIENT_PARTNER = 'client_partner',
  TECHNICIAN = 'technician',
  DRIVER = 'driver',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload extends LoginPayload {
  name: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface AuthError {
  success: false
  error: string
}

export interface AuthSuccess {
  success: true
}

export type AuthResult = AuthSuccess | AuthError
