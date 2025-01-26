import { defineStore } from 'pinia'
import { ref } from 'vue'
import maintenanceService from '../services/maintenance.service'
import type { Bike, Maintenance } from '../services/maintenance.service'

export const useMaintenanceStore = defineStore('maintenance', () => {
  const dueMaintenances = ref<Maintenance[]>([])
  const bikes = ref<Bike[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBikes() {
    try {
      loading.value = true
      error.value = null
      bikes.value = await maintenanceService.getBikes()
      return bikes.value
    } catch (err) {
      error.value = 'Erreur lors de la récupération des motos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBike(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createBike(data)
      await fetchBikes()
    } catch (err) {
      error.value = 'Erreur lors de la création de la moto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMaintenance(data: {
    id: string
    bikeId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }) {
    try {
      loading.value = true
      error.value = null
      await maintenanceService.createMaintenance(data)
      await fetchDueMaintenances()
    } catch (err) {
      error.value = 'Erreur lors de la création de la maintenance'
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
      error.value = 'Erreur lors de la récupération des maintenances'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    dueMaintenances,
    bikes,
    loading,
    error,
    fetchBikes,
    createBike,
    createMaintenance,
    fetchDueMaintenances,
  }
})
