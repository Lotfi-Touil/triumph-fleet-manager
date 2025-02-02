import mainAxios from './axios'

export enum UserRole {
  ADMIN = "admin",
  FLEET_MANAGER = "fleet_manager",
  CLIENT_PARTNER = "client_partner",
  TECHNICIAN = "technician",
  DRIVER = "driver",
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

class UserService {
  private readonly baseUrl = '/users'

  async getTechnicians(): Promise<User[]> {
    const response = await mainAxios.get<User[]>(`${this.baseUrl}/technicians`)
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await mainAxios.get<User>(`${this.baseUrl}/me`)
    return response.data
  }
}

export const userService = new UserService()
