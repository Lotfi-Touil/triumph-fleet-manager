import { defineStore } from 'pinia'
import maintenanceService from '../services/maintenance.service'
import type { MaintenanceSchedule } from '../services/maintenance.service'
import { ref } from 'vue'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const dueMaintenances = ref<MaintenanceSchedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createBikeModel(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createBikeModel(data)
    } catch (err) {
      error.value = 'Erreur lors de la création du modèle de moto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMaintenanceSchedule(data: {
    id: string
    bikeModelId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createMaintenanceSchedule(data)
      await fetchDueMaintenances()
    } catch (err) {
      error.value = "Erreur lors de la création de la planification d'entretien"
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDueMaintenances() {
    try {
      loading.value = true
      error.value = null
      dueMaintenances.value = await maintenanceService.getDueMaintenances()
    } catch (err) {
      error.value = 'Erreur lors de la récupération des entretiens à effectuer'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    dueMaintenances,
    loading,
    error,
    createBikeModel,
    createMaintenanceSchedule,
    fetchDueMaintenances,
  }
})
