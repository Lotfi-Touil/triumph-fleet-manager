import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService, { type User } from '../services/auth.service'
import { AxiosError } from 'axios'
import { profileService } from '../services/profile.service'

interface AuthState {
  user: User | null
  error: string | null
}

interface AuthResult {
  success: boolean
  message?: string
}

interface ApiError {
  statusCode: number
  message: string
  error: string
}

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>({
    user: null,
    error: null,
  })
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!state.value.user)

  async function loadUser() {
    if (token.value) {
      try {
        const user = await profileService.getProfile()
        state.value.user = user
      } catch (error) {
        console.error('Error loading user profile:', error)
        logout()
        throw error
      }
    }
  }

  async function initializeFromToken(savedToken: string) {
    token.value = savedToken
    authService.setToken(savedToken)
    await loadUser()
  }

  async function init() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      await initializeFromToken(savedToken)
    }
  }

  async function login({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<AuthResult> {
    try {
      const response = await authService.login({ email, password })
      token.value = response.token
      authService.setToken(response.token)
      state.value.user = response.user
      return { success: true }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError
        state.value.error = apiError.message
        return { success: false, message: apiError.message }
      }
      return { success: false, message: 'Une erreur est survenue' }
    }
  }

  async function signup({
    email,
    password,
    name,
  }: {
    email: string
    password: string
    name: string
  }): Promise<AuthResult> {
    try {
      const response = await authService.signup({ email, password, name })
      token.value = response.token
      authService.setToken(response.token)
      state.value.user = response.user
      return { success: true }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError
        state.value.error = apiError.message
        return { success: false, message: apiError.message }
      }
      return { success: false, message: 'Une erreur est survenue' }
    }
  }

  function logout() {
    state.value.user = null
    state.value.error = null
    token.value = null
    authService.removeToken()
  }

  return {
    user: computed(() => state.value.user),
    error: computed(() => state.value.error),
    isAuthenticated,
    login,
    signup,
    logout,
    init,
    initializeFromToken,
  }
})
