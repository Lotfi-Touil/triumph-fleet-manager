import mainAxios from './axios'
import axios from 'axios'

const sparePartsAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
})

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
  maintenanceSchedule?: MaintenanceSchedule
  sparePart?: {
    id: string
    name: string
    quantity: number
    minQuantity: number
  }
  createdAt: Date
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED'
  message: string
  type: 'MAINTENANCE' | 'LOW_STOCK'
}

class MaintenanceService {
  private readonly baseUrl = '/maintenance'

  async getBikeModels(): Promise<BikeModel[]> {
    const response = await mainAxios.get(`${this.baseUrl}/bike-models`)
    return response.data
  }

  async createBikeModel(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }): Promise<void> {
    await mainAxios.post(`${this.baseUrl}/bike-models`, data)
  }

  async createMaintenanceSchedule(data: {
    id: string
    bikeModelId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }): Promise<void> {
    await mainAxios.post(`${this.baseUrl}/schedules`, data)
  }

  async getDueMaintenances(): Promise<MaintenanceSchedule[]> {
    const response = await mainAxios.get(`${this.baseUrl}/due`)
    return response.data
  }

  async getNotifications(): Promise<MaintenanceNotification[]> {
    const response = await mainAxios.get(`${this.baseUrl}/notifications`)
    return response.data
  }

  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    const response = await mainAxios.get(`${this.baseUrl}/notifications/pending`)
    return response.data
  }

  async getLowStockNotifications(): Promise<MaintenanceNotification[]> {
    const response = await sparePartsAxios.get('/spare-parts/notifications/low-stock')
    return response.data.map((notif: any) => ({
      ...notif,
      createdAt: new Date(notif.createdAt)
    }))
  }

  async acknowledgeNotification(id: string, type: 'MAINTENANCE' | 'LOW_STOCK' = 'MAINTENANCE'): Promise<void> {
    if (type === 'LOW_STOCK') {
      const sparePartId = id.replace('low-stock-', '')
      await sparePartsAxios.put(`/spare-parts/${sparePartId}/acknowledge-low-stock`)
    } else {
      await mainAxios.put(`${this.baseUrl}/notifications/${id}/acknowledge`)
    }
  }
}

export default new MaintenanceService()
