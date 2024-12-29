import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/services/axios'
import type { Router } from 'vue-router'
import type { User, LoginPayload, SignupPayload, AuthResponse, AuthResult } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // Initialize from localStorage
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token.value = storedToken
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }

  const login = async (payload: LoginPayload, router: Router): Promise<AuthResult> => {
    try {
      const response = await axios.post<AuthResponse>('/auth/login', payload)
      user.value = response.data.user
      token.value = response.data.access_token

      localStorage.setItem('token', response.data.access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`

      router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login',
      }
    }
  }

  const signup = async (payload: SignupPayload, router: Router): Promise<AuthResult> => {
    try {
      await axios.post('/auth/register', payload)
      return login({ email: payload.email, password: payload.password }, router)
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during signup',
      }
    }
  }

  const logout = (router: Router) => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  return {
    user,
    token,
    login,
    signup,
    logout,
  }
})
