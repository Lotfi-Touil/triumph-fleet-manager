import mainAxios from './axios'
import axios from 'axios'

const sparePartsAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
})

export interface Bike {
  id: string
  name: string
  maintenanceKilometers: number
  maintenanceMonths: number
}

export interface Maintenance {
  id: string
  bike: Bike
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
  maintenance: Maintenance
  createdAt: Date
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED'
  message: string
  type: 'MAINTENANCE' | 'LOW_STOCK'
}

class MaintenanceService {
  private readonly baseUrl = '/maintenance'

  async getBikes(): Promise<Bike[]> {
    const response = await axios.get(`${this.baseUrl}/bikes`)
    return response.data
  }

  async createBike(data: {
    id: string
    name: string
    maintenanceKilometers: number
    maintenanceMonths: number
  }): Promise<void> {
    await mainAxios.post(`${this.baseUrl}/bikes`, data)
  }

  async createMaintenance(data: {
    id: string
    bikeId: string
    lastMaintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
  }): Promise<void> {
    await mainAxios.post(`${this.baseUrl}/maintenances`, data)
  }

  async getDueMaintenances(): Promise<Maintenance[]> {
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
