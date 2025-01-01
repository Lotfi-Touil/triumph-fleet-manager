import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import { useToast } from 'vue-toastification'
import authService from '@/services/auth.service'
import type { User, UserRole } from '@/types/auth'
import type { SignupDTO, LoginDTO } from '@/services/auth.service'

export interface AuthResult {
  success: boolean
  error?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const toast = useToast()

  // Initialize from localStorage
  const storedToken = authService.getToken()
  if (storedToken) {
    token.value = storedToken
  }

  const login = async (payload: LoginDTO, router: Router): Promise<AuthResult> => {
    try {
      const response = await authService.login(payload)
      user.value = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as UserRole,
      }
      token.value = response.token
      authService.setToken(response.token)
      router.push('/dashboard')
      toast.success('Connexion réussie')
      return { success: true }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } }
      const errorMessage =
        err.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      toast.error(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const signup = async (payload: SignupDTO, router: Router): Promise<AuthResult> => {
    try {
      const response = await authService.signup(payload)
      user.value = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as UserRole,
      }
      token.value = response.token
      authService.setToken(response.token)
      router.push('/dashboard')
      toast.success('Inscription réussie')
      return { success: true }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } }
      const errorMessage =
        err.response?.data?.message || "Une erreur est survenue lors de l'inscription"
      toast.error(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = (router: Router) => {
    user.value = null
    token.value = null
    authService.removeToken()
    router.push('/login')
    toast.success('Déconnexion réussie')
  }

  return {
    user,
    token,
    login,
    signup,
    logout,
  }
})
