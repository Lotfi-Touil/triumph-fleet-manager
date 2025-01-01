import { defineStore } from 'pinia'
import { ref } from 'vue'
import maintenanceService, { type MaintenanceNotification } from '../services/maintenance.service'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<MaintenanceNotification[]>([])
  const pendingNotifications = ref<MaintenanceNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchNotifications() {
    try {
      loading.value = true
      error.value = null
      notifications.value = await maintenanceService.getNotifications()
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPendingNotifications() {
    try {
      loading.value = true
      error.value = null
      pendingNotifications.value = await maintenanceService.getPendingNotifications()
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications en attente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function acknowledgeNotification(id: string) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.acknowledgeNotification(id)
      await fetchPendingNotifications()
      await fetchNotifications()
    } catch (err) {
      error.value = "Erreur lors de l'acquittement de la notification"
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    pendingNotifications,
    loading,
    error,
    fetchNotifications,
    fetchPendingNotifications,
    acknowledgeNotification,
  }
})
