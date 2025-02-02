import axios from './axios'
import type { Trial, CreateTrialDTO, UpdateTrialDTO } from '@/types/trial'

export const trialService = {
  async getAllTrials(): Promise<Trial[]> {
    const response = await axios.get('/trials')
    return response.data
  },

  async getTrialsByDriver(driverId: string): Promise<Trial[]> {
    const response = await axios.get(`/trials/driver/${driverId}`)
    return response.data
  },

  async getTrialsByBike(bikeId: string): Promise<Trial[]> {
    const response = await axios.get(`/trials/bike/${bikeId}`)
    return response.data
  },

  async createTrial(trial: CreateTrialDTO): Promise<Trial> {
    const response = await axios.post('/trials', trial)
    return response.data
  },

  async endTrial(id: string, data: UpdateTrialDTO): Promise<Trial> {
    const response = await axios.put(`/trials/${id}/end`, data)
    return response.data
  },

  async deleteTrial(id: string): Promise<void> {
    await axios.delete(`/trials/${id}`)
  }
} 