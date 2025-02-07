import axios from './axios'
import { AxiosError } from 'axios'

export interface SignupDTO {
  email: string
  password: string
  name: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {
  private readonly BASE_URL = '/auth'

  async signup(data: SignupDTO): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${this.BASE_URL}/signup`, data)
    return response.data
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    console.log('Tentative de login avec:', { email: data.email });
    try {
      const response = await axios.post<AuthResponse>(`${this.BASE_URL}/login`, data);
      console.log('Réponse reçue:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Erreur login:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  removeToken(): void {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default new AuthService()
