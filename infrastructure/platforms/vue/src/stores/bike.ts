import { ref } from 'vue'
import { defineStore } from 'pinia'
import { bikeService, type Bike } from '../services/bike.service'

export const useBikeStore = defineStore('bike', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const bikes = ref<Bike[]>([])

  async function fetchBikes() {
    try {
      loading.value = true
      error.value = null
      bikes.value = await bikeService.getAll()
    } catch (err) {
      error.value = 'Erreur lors de la récupération des motos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBike(data: Omit<Bike, 'id'>) {
    try {
      loading.value = true
      error.value = null
      await bikeService.create(data)
      await fetchBikes()
    } catch (err) {
      error.value = 'Erreur lors de la création de la moto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBike(data: Bike) {
    try {
      loading.value = true
      error.value = null
      await bikeService.update(data)
      await fetchBikes()
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la moto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBike(id: string) {
    try {
      loading.value = true
      error.value = null
      await bikeService.delete(id)
      await fetchBikes()
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la moto'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bikes,
    loading,
    error,
    fetchBikes,
    createBike,
    updateBike,
    deleteBike,
  }
}) 