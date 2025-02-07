import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { maintenanceService, type MaintenanceNotification, NotificationType } from '../services/maintenance.service'
import { notificationEventService } from '../services/events.service'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<MaintenanceNotification[]>([])
  const pendingNotifications = ref<MaintenanceNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalPendingCount = computed(() => pendingNotifications.value.length)

  function showSuccess(message: string) {
    // Vous pouvez implémenter ici une logique pour afficher les notifications de succès
    // Par exemple, en utilisant une bibliothèque de toast ou en ajoutant à une liste de notifications
    console.log('Success:', message)
  }

  function showError(message: string) {
    // Vous pouvez implémenter ici une logique pour afficher les notifications d'erreur
    console.log('Error:', message)
  }

  async function fetchAllNotifications() {
    try {
      loading.value = true
      error.value = null
      const [maintenance, lowStock] = await Promise.all([
        maintenanceService.getPendingNotifications(),
        maintenanceService.getLowStockNotifications(),
      ])

      // Fusionner les notifications en conservant les existantes si pas de changement
      const currentNotifications = pendingNotifications.value
      const newMaintenanceNotifs = maintenance.filter(
        (m: MaintenanceNotification) => !currentNotifications.some((c) => c.id === m.id && c.type === NotificationType.MAINTENANCE),
      )
      const newLowStockNotifs = lowStock.filter(
        (l: MaintenanceNotification) => !currentNotifications.some((c) => c.id === l.id && c.type === NotificationType.LOW_STOCK),
      )

      // Garder les notifications existantes qui n'ont pas été acquittées
      const existingNotifs = currentNotifications.filter((n: MaintenanceNotification) =>
        [...maintenance, ...lowStock].some((m) => m.id === n.id),
      )

      // Mettre à jour la liste avec les nouvelles notifications en premier
      pendingNotifications.value = [
        ...newMaintenanceNotifs,
        ...newLowStockNotifs,
        ...existingNotifs,
      ]
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications'
      console.error('Error fetching notifications:', err)
    } finally {
      loading.value = false
    }
  }

  function startAutoRefresh() {
    notificationEventService.startListening(fetchAllNotifications)
  }

  function stopAutoRefresh() {
    notificationEventService.stopListening()
  }

  async function acknowledgeNotification(
    id: string,
    type: NotificationType = NotificationType.MAINTENANCE,
  ) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.acknowledgeNotification(id, type)
      // Mettre à jour la liste des notifications immédiatement
      pendingNotifications.value = pendingNotifications.value.filter((notif: MaintenanceNotification) => notif.id !== id)
    } catch (err) {
      error.value = 'Erreur lors de la confirmation de la notification'
      console.error('Error acknowledging notification:', err)
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
    acknowledgeNotification,
    startAutoRefresh,
    stopAutoRefresh,
    showSuccess,
    showError
  }
})
