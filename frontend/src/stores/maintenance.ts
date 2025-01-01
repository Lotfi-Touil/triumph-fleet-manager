import { defineStore } from 'pinia'
import { ref } from 'vue'
import maintenanceService from '../services/maintenance.service'
import type { BikeModel, MaintenanceSchedule } from '../services/maintenance.service'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const dueMaintenances = ref<MaintenanceSchedule[]>([])
  const bikeModels = ref<BikeModel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBikeModels() {
    try {
      loading.value = true
      error.value = null
      bikeModels.value = await maintenanceService.getBikeModels()
      return bikeModels.value
    } catch (err) {
      error.value = 'Erreur lors de la récupération des modèles'
      throw err
    } finally {
      loading.value = false
    }
  }

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
      await fetchBikeModels()
    } catch (err) {
      error.value = 'Erreur lors de la création du modèle'
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
      error.value = 'Erreur lors de la création de la planification'
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
      error.value = 'Erreur lors de la récupération des entretiens'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    dueMaintenances,
    bikeModels,
    loading,
    error,
    fetchBikeModels,
    createBikeModel,
    createMaintenanceSchedule,
    fetchDueMaintenances,
  }
})
