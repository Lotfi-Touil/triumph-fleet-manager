import { ref } from 'vue'
import { defineStore } from 'pinia'
import { breakdownService } from '../services/breakdown.service'
import type { Breakdown, SparePartRequest } from '../services/breakdown.service'
import { BreakdownType, BreakdownStatus } from '../services/breakdown.service'

export const useBreakdownStore = defineStore('breakdown', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const breakdowns = ref<Breakdown[]>([])

  async function fetchBreakdowns(): Promise<Breakdown[]> {
    try {
      loading.value = true
      error.value = null
      const result = await breakdownService.getBreakdowns()
      breakdowns.value = result
      return result
    } catch {
      error.value = 'Erreur lors de la récupération des pannes'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchBreakdownsByBike(bikeId: string): Promise<Breakdown[]> {
    try {
      loading.value = true
      error.value = null
      const result = await breakdownService.getBreakdownsByBike(bikeId)
      breakdowns.value = result
      return result
    } catch {
      error.value = 'Erreur lors de la récupération des pannes pour cette moto'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUnresolvedBreakdowns(): Promise<Breakdown[]> {
    try {
      loading.value = true
      error.value = null
      const result = await breakdownService.getUnresolvedBreakdowns()
      breakdowns.value = result
      return result
    } catch {
      error.value = 'Erreur lors de la récupération des pannes non résolues'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createBreakdown(data: {
    bikeId: string
    description: string
    type: BreakdownType
    warrantyApplied: boolean
    spareParts?: SparePartRequest[]
  }): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await breakdownService.createBreakdown(data)
      await fetchBreakdowns()
    } catch {
      error.value = 'Erreur lors de la création de la panne'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateBreakdown(
    id: string,
    data: {
    status?: BreakdownStatus
    repairActions?: string
    technicalRecommendations?: string
      spareParts?: SparePartRequest[]
    warrantyApplied?: boolean
    },
  ): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await breakdownService.updateBreakdown(id, data)
      await fetchBreakdowns()
    } catch {
      error.value = 'Erreur lors de la mise à jour de la panne'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteBreakdown(id: string): Promise<void> {
    try {
      loading.value = true
      error.value = null
      await breakdownService.deleteBreakdown(id)
      await fetchBreakdowns()
    } catch {
      error.value = 'Erreur lors de la suppression de la panne'
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    breakdowns,
    fetchBreakdowns,
    fetchBreakdownsByBike,
    fetchUnresolvedBreakdowns,
    createBreakdown,
    updateBreakdown,
    deleteBreakdown,
  }
})
