import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/services/axios'
import type { Router } from 'vue-router'

interface User {
  id: number
  email: string
  name: string
}

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload extends LoginPayload {
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // Initialize from localStorage
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token.value = storedToken
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }

  const login = async ({ email, password }: LoginPayload, router: Router) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('token', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      router.push('/home')
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login',
      }
    }
  }

  const signup = async ({ email, password, name }: SignupPayload, router: Router) => {
    try {
      const response = await axios.post('/auth/signup', { email, password, name })
      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('token', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      router.push('/home')
      return { success: true }
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
