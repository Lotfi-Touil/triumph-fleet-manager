import { ref } from 'vue'
import { defineStore } from 'pinia'
import { maintenanceService, type Maintenance, MaintenanceStatus, MaintenanceType } from '../services/maintenance.service'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const maintenances = ref<Maintenance[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMaintenances() {
    try {
      loading.value = true
      error.value = null
      maintenances.value = await maintenanceService.getMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching maintenances'
    } finally {
      loading.value = false
    }
  }

  async function fetchMaintenancesByBike(bikeId: string) {
    try {
      loading.value = true
      error.value = null
      maintenances.value = await maintenanceService.getMaintenancesByBike(bikeId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching maintenances'
    } finally {
      loading.value = false
    }
  }

  async function fetchMaintenancesByStatus(status: MaintenanceStatus) {
    try {
      loading.value = true
      error.value = null
      maintenances.value = await maintenanceService.getMaintenancesByStatus(status)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching maintenances'
    } finally {
      loading.value = false
    }
  }

  async function fetchScheduledMaintenances() {
    try {
      loading.value = true
      error.value = null
      maintenances.value = await maintenanceService.getScheduledMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching scheduled maintenances'
    } finally {
      loading.value = false
    }
  }

  async function fetchCompletedMaintenances() {
    try {
      loading.value = true
      error.value = null
      maintenances.value = await maintenanceService.getCompletedMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching completed maintenances'
    } finally {
      loading.value = false
    }
  }

  async function getDueMaintenances(): Promise<Maintenance[]> {
    try {
      loading.value = true
      error.value = null
      return await maintenanceService.getDueMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while fetching due maintenances'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createMaintenance(data: {
    bikeId: string
    maintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
    technicianId?: string
    type: MaintenanceType
    replacedParts?: string[]
    cost?: number
    technicalRecommendations?: string
    workDescription?: string
    nextRecommendedMaintenanceDate?: string
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createMaintenance(data)
      await fetchMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while creating maintenance'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateMaintenance(
    id: string,
    data: {
      status?: MaintenanceStatus
      technicianId?: string
      type?: MaintenanceType
      replacedParts?: string[]
      cost?: number
      technicalRecommendations?: string
      workDescription?: string
      nextRecommendedMaintenanceDate?: string
    }
  ) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.updateMaintenance(id, data)
      await fetchMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while updating maintenance'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateMaintenanceKilometers(data: {
    maintenanceId: string
    newKilometers: number
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.updateMaintenanceKilometers(data)
      await fetchMaintenances()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while updating maintenance kilometers'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteMaintenance(id: string) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.deleteMaintenance(id)
      maintenances.value = maintenances.value.filter(m => m.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred while deleting maintenance'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    maintenances,
    loading,
    error,
    fetchMaintenances,
    fetchMaintenancesByBike,
    fetchMaintenancesByStatus,
    fetchScheduledMaintenances,
    fetchCompletedMaintenances,
    getDueMaintenances,
    createMaintenance,
    updateMaintenance,
    updateMaintenanceKilometers,
    deleteMaintenance
  }
})
