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

export interface MaintenanceNotification {
  id: string
  maintenanceSchedule: MaintenanceSchedule
  createdAt: Date
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED'
  message: string
}

class MaintenanceService {
  private readonly baseUrl = '/maintenance'

  async getBikeModels(): Promise<BikeModel[]> {
    const response = await axios.get(`${this.baseUrl}/bike-models`)
    return response.data
  }

  async createBikeModel(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }): Promise<void> {
    await axios.post(`${this.baseUrl}/bike-models`, data)
  }

  async createMaintenanceSchedule(data: {
    id: string
    bikeModelId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }): Promise<void> {
    await axios.post(`${this.baseUrl}/schedules`, data)
  }

  async getDueMaintenances(): Promise<MaintenanceSchedule[]> {
    const response = await axios.get(`${this.baseUrl}/due`)
    return response.data
  }

  async getNotifications(): Promise<MaintenanceNotification[]> {
    const response = await axios.get(`${this.baseUrl}/notifications`)
    return response.data
  }

  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    const response = await axios.get(`${this.baseUrl}/notifications/pending`)
    return response.data
  }

  async acknowledgeNotification(id: string): Promise<void> {
    await axios.put(`${this.baseUrl}/notifications/${id}/acknowledge`)
  }
}

export default new MaintenanceService()
