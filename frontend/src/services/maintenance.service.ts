import axios from './axios'

export interface BikeModel {
  id: string
  name: string
  maintenanceKilometers: number
  maintenanceMonths: number
}

export interface MaintenanceSchedule {
  id: string
  bikeModel: BikeModel
  lastMaintenanceDate: Date
  lastMaintenanceKilometers: number
  currentKilometers: number
}

class MaintenanceService {
  async createBikeModel(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }): Promise<void> {
    await axios.post('/maintenance/bike-models', data)
  }

  async createMaintenanceSchedule(data: {
    id: string
    bikeModelId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }): Promise<void> {
    await axios.post('/maintenance/schedules', data)
  }

  async getDueMaintenances(): Promise<MaintenanceSchedule[]> {
    const response = await axios.get('/maintenance/due')
    return response.data
  }
}

export default new MaintenanceService()
