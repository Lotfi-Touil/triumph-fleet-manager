import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Trial, CreateTrialDTO, UpdateTrialDTO } from '@/types/trial'
import { trialService } from '@/services/trial.service'
import { useNotificationStore } from './notifications'

export const useTrialStore = defineStore('trial', () => {
  const trials = ref<Trial[]>([])
  const loading = ref(false)
  const notificationStore = useNotificationStore()

  async function fetchTrials() {
    try {
      loading.value = true
      trials.value = await trialService.getAllTrials()
    } catch (error) {
      notificationStore.showError('Erreur lors du chargement des essais')
      console.error('Error fetching trials:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrialsByDriver(driverId: string) {
    try {
      loading.value = true
      trials.value = await trialService.getTrialsByDriver(driverId)
    } catch (error) {
      notificationStore.showError('Erreur lors du chargement des essais du conducteur')
      console.error('Error fetching driver trials:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchTrialsByBike(bikeId: string) {
    try {
      loading.value = true
      trials.value = await trialService.getTrialsByBike(bikeId)
    } catch (error) {
      notificationStore.showError('Erreur lors du chargement des essais de la moto')
      console.error('Error fetching bike trials:', error)
    } finally {
      loading.value = false
    }
  }

  async function createTrial(trial: CreateTrialDTO) {
    try {
      loading.value = true
      const newTrial = await trialService.createTrial(trial)
      trials.value.push(newTrial)
      notificationStore.showSuccess('Essai créé avec succès')
    } catch (error) {
      notificationStore.showError('Erreur lors de la création de l\'essai')
      console.error('Error creating trial:', error)
    } finally {
      loading.value = false
    }
  }

  async function endTrial(id: string, data: UpdateTrialDTO) {
    try {
      loading.value = true
      const updatedTrial = await trialService.endTrial(id, data)
      const index = trials.value.findIndex(t => t.id === id)
      if (index !== -1) {
        trials.value[index] = updatedTrial
      }
      notificationStore.showSuccess('Essai terminé avec succès')
    } catch (error) {
      notificationStore.showError('Erreur lors de la fin de l\'essai')
      console.error('Error ending trial:', error)
    } finally {
      loading.value = false
    }
  }

  async function deleteTrial(id: string) {
    try {
      loading.value = true
      await trialService.deleteTrial(id)
      trials.value = trials.value.filter(t => t.id !== id)
      notificationStore.showSuccess('Essai supprimé avec succès')
    } catch (error) {
      notificationStore.showError('Impossible de supprimer l\'essai')
      console.error('Error deleting trial:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    trials,
    loading,
    fetchTrials,
    fetchTrialsByDriver,
    fetchTrialsByBike,
    createTrial,
    endTrial,
    deleteTrial
  }
}) 