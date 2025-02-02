import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userService } from '../services/user.service'
import type { User } from '../services/user.service'

export const useUserStore = defineStore('user', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const technicians = ref<User[]>([])

  async function getTechnicians(): Promise<User[]> {
    try {
      loading.value = true
      error.value = null
      const users = await userService.getTechnicians()
      technicians.value = users
      return users
    } catch (err) {
      error.value = 'Erreur lors de la récupération des techniciens'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    technicians,
    getTechnicians,
  }
})
