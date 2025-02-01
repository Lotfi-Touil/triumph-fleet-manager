import mainAxios from './axios'
import axios from 'axios'

const sparePartsAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Bike {
  id: string
  name: string
  registrationNumber: string
  maintenanceInterval: {
    kilometerInterval: number
    monthInterval: number
  }
}

export interface Maintenance {
  id: string
  bike: Bike
  lastMaintenanceDate: string
  lastMaintenanceKilometers: number
  currentKilometers: number
}

export interface MaintenanceSchedule {
  id: string
  bike: Bike
  scheduledDate: string
  scheduledKilometers: number
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
  message: string
  type: 'MAINTENANCE' | 'LOW_STOCK'
  status: 'PENDING' | 'ACKNOWLEDGED'
  createdAt: string
}

class MaintenanceService {
  private readonly baseUrl = '/maintenance'

  async createMaintenance(data: {
    bikeId: string
    date: string
    kilometers: number
  }): Promise<void> {
    await mainAxios.post(`${this.baseUrl}/create-maintenance`, data)
  }

  async updateMaintenance(data: {
    id: string
    bikeId: string
    date: string
    kilometers: number
  }): Promise<void> {
    await mainAxios.put(`${this.baseUrl}/update-maintenance/${data.id}`, {
      bikeId: data.bikeId,
      date: data.date,
      kilometers: data.kilometers,
    })
  }

  async deleteMaintenance(id: string): Promise<void> {
    await mainAxios.delete(`${this.baseUrl}/delete-maintenance/${id}`)
  }

  async getDueMaintenances(): Promise<Maintenance[]> {
    const response = await mainAxios.get<Maintenance[]>(`${this.baseUrl}/due-maintenances`)
    return response.data
  }

  async getAllMaintenances(): Promise<Maintenance[]> {
    const response = await mainAxios.get<Maintenance[]>(`${this.baseUrl}/all-maintenances`)
    return response.data
  }

  async getNotifications(): Promise<MaintenanceNotification[]> {
    const response = await mainAxios.get<MaintenanceNotification[]>(`${this.baseUrl}/notifications`)
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
      createdAt: new Date(notif.createdAt),
    }))
  }

  async acknowledgeNotification(
    id: string,
    type: 'MAINTENANCE' | 'LOW_STOCK' = 'MAINTENANCE',
  ): Promise<void> {
    if (type === 'LOW_STOCK') {
      const sparePartId = id.replace('low-stock-', '')
      await sparePartsAxios.put(`/spare-parts/${sparePartId}/acknowledge-low-stock`)
    } else {
      await mainAxios.put(`${this.baseUrl}/notifications/${id}/acknowledge`)
    }
  }

  async updateMaintenanceKilometers(data: {
    maintenanceId: string
    kilometers: number
    bikeId: string
    lastMaintenanceDate: string
  }): Promise<void> {
    await mainAxios.put(`${this.baseUrl}/update-maintenance/${data.maintenanceId}`, {
      bikeId: data.bikeId,
      date: data.lastMaintenanceDate,
      kilometers: data.kilometers,
    })
  }
}

export const maintenanceService = new MaintenanceService()
