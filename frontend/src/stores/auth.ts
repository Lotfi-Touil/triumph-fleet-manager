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
      setToken(response.token)
      user.value = response.user
      router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login',
      }
    }
  }

  async function signup(payload: SignupDTO, router: Router) {
    try {
      const response = await authService.signup(payload)
      setToken(response.token)
      user.value = response.user
      router.push('/dashboard')
      return { success: true }
    } catch (error: any) {
      console.error('Signup error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during signup',
      }
    }
  }

  function logout(router?: Router) {
    user.value = null
    setToken(null)
    if (router) {
      router.push('/login')
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
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
