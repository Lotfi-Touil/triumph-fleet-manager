import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Router } from 'vue-router'
import authService from '../services/auth.service'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface LoginDTO {
  email: string
  password: string
}

interface SignupDTO {
  email: string
  password: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(payload: LoginDTO, router: Router) {
    try {
      const response = await authService.login(payload)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function signup(payload: SignupDTO, router: Router) {
    try {
      const response = await authService.signup(payload)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
  }
})
