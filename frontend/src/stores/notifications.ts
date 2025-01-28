import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { maintenanceService, type MaintenanceNotification } from '../services/maintenance.service'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<MaintenanceNotification[]>([])
  const pendingNotifications = ref<MaintenanceNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let pollingInterval: number | null = null

  const totalPendingCount = computed(() => pendingNotifications.value.length)

  async function fetchAllNotifications() {
    try {
      loading.value = true
      error.value = null
      const [maintenance, lowStock] = await Promise.all([
        maintenanceService.getPendingNotifications(),
        maintenanceService.getLowStockNotifications()
      ])
      console.log('Maintenance notifications:', maintenance)
      console.log('Low stock notifications:', lowStock)

      // Parse dates for low stock notifications
      const parsedLowStock = lowStock.map(notif => ({
        ...notif,
        createdAt: notif.createdAt // Keep as string instead of converting to Date
      }))

      pendingNotifications.value = [...maintenance, ...parsedLowStock]
      console.log('Total notifications:', pendingNotifications.value.length)
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  function startPolling() {
    // Rafraîchir toutes les 30 secondes
    pollingInterval = window.setInterval(() => {
      fetchAllNotifications()
    }, 30000)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

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
      error.value = 'Erreur lors de la récupération des notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function acknowledgeNotification(id: string, type: 'MAINTENANCE' | 'LOW_STOCK' = 'MAINTENANCE') {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.acknowledgeNotification(id, type)
      await fetchAllNotifications()
    } catch (err) {
      error.value = 'Erreur lors de la confirmation de la notification'
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
    totalPendingCount,
    fetchAllNotifications,
    fetchNotifications,
    fetchPendingNotifications,
    acknowledgeNotification,
    startPolling,
    stopPolling
  }
})
