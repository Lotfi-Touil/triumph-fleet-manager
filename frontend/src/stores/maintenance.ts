import { ref } from 'vue'
import { defineStore } from 'pinia'
import { maintenanceService, type Maintenance, type MaintenanceNotification } from '../services/maintenance.service'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dueMaintenances = ref<Maintenance[]>([])

  async function createMaintenance(data: {
    bikeId: string;
    date: string;
    kilometers: number;
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createMaintenance(data)
    } catch (err) {
      error.value = 'Erreur lors de la création de la maintenance'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getDueMaintenances(): Promise<Maintenance[]> {
    try {
      loading.value = true
      error.value = null
      dueMaintenances.value = await maintenanceService.getDueMaintenances()
      return dueMaintenances.value
    } catch (err) {
      error.value = 'Erreur lors de la récupération des maintenances à prévoir'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getNotifications(): Promise<MaintenanceNotification[]> {
    try {
      loading.value = true
      error.value = null
      return await maintenanceService.getNotifications()
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
      return await maintenanceService.getPendingNotifications()
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
    createMaintenance,
    getDueMaintenances,
    getNotifications,
    getPendingNotifications,
    acknowledgeNotification,
  }
})
