import { ref } from 'vue'
import { defineStore } from 'pinia'
import { maintenanceService } from '../services/maintenance.service'
import type { Maintenance, MaintenanceNotification } from '../services/maintenance.service'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dueMaintenances = ref<Maintenance[]>([])
  const notifications = ref<MaintenanceNotification[]>([])

  async function getDueMaintenances(): Promise<Maintenance[]> {
    try {
      loading.value = true
      error.value = null
      const maintenances = await maintenanceService.getDueMaintenances()
      dueMaintenances.value = maintenances
      return maintenances
    } catch (err) {
      error.value = 'Erreur lors de la récupération des entretiens'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMaintenance(data: {
    bikeId: string
    date: string
    kilometers: number
  }): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createMaintenance(data)
      await getDueMaintenances()
    } catch (err) {
      error.value = "Erreur lors de la création de l'entretien"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMaintenance(data: {
    id: string
    bikeId: string
    date: string
    kilometers: number
  }): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.updateMaintenance(data)
      await getDueMaintenances()
    } catch (err) {
      error.value = "Erreur lors de la modification de l'entretien"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteMaintenance(id: string): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.deleteMaintenance(id)
      await getDueMaintenances()
    } catch (err) {
      error.value = "Erreur lors de la suppression de l'entretien"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getNotifications(): Promise<MaintenanceNotification[]> {
    try {
      loading.value = true
      error.value = null
      const result = await maintenanceService.getNotifications()
      notifications.value = result
      return result
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getPendingNotifications(): Promise<MaintenanceNotification[]> {
    try {
      loading.value = true
      error.value = null
      const result = await maintenanceService.getPendingNotifications()
      notifications.value = result
      return result
    } catch (err) {
      error.value = 'Erreur lors de la récupération des notifications en attente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function acknowledgeNotification(id: string): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.acknowledgeNotification(id)
      await getNotifications()
    } catch (err) {
      error.value = 'Erreur lors de la confirmation de la notification'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    dueMaintenances,
    notifications,
    getDueMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    getNotifications,
    getPendingNotifications,
    acknowledgeNotification,
  }
})
