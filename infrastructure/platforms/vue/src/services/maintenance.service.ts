import axios from './axios'
import type { Bike } from './bike.service'
import { sparePartsService } from './spare-parts.service'

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  REGULAR = 'REGULAR',
  INSPECTION = 'INSPECTION',
}

export enum NotificationType {
  MAINTENANCE = 'MAINTENANCE',
  LOW_STOCK = 'LOW_STOCK',
}

export interface MaintenanceNotification {
  id: string
  type: NotificationType
  message: string
  createdAt: string
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED'
  maintenance: {
    id: string
    bike: {
      id: string
      name: string
      registrationNumber: string
      maintenanceInterval: {
        kilometers: number
        monthInterval: number
      }
    }
    maintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
    technician: {
      id: string
      name: string
      email: string
    } | null
    status: MaintenanceStatus
    type: MaintenanceType
    replacedParts: string[]
    cost: number
    technicalRecommendations: string
    workDescription: string
    nextRecommendedMaintenanceDate: string | null
  }
}

export interface Maintenance {
  id: string
  bike: Bike
  maintenanceDate: string
  lastMaintenanceKilometers: number
  currentKilometers: number
  technician: {
    id: string
    name: string
    email: string
  } | null
  status: MaintenanceStatus
  type: MaintenanceType
  replacedParts: string[]
  cost: number
  technicalRecommendations: string
  workDescription: string
  nextRecommendedMaintenanceDate: string | null
}

interface RawMaintenance {
  id: string
  bike: Bike
  maintenanceDate: string
  lastMaintenanceKilometers: string | number
  currentKilometers: string | number
  technician: {
    id: string
    name: string
    email: string
  } | null
  status: MaintenanceStatus
  type: MaintenanceType
  replacedParts: string[]
  cost: string | number
  technicalRecommendations: string
  workDescription: string
  nextRecommendedMaintenanceDate: string | null
}

class MaintenanceService {
  private readonly baseUrl = '/maintenances'

  private transformMaintenance(data: RawMaintenance): Maintenance {
    return {
      ...data,
      lastMaintenanceKilometers: Number(data.lastMaintenanceKilometers),
      currentKilometers: Number(data.currentKilometers),
      cost: Number(data.cost),
    }
  }

  async createMaintenance(data: {
    bikeId: string
    maintenanceDate: string
    lastMaintenanceKilometers: number
    currentKilometers: number
    technicianId?: string
    type: MaintenanceType
    replacedParts?: string[]
    cost?: number
    technicalRecommendations?: string
    workDescription?: string
    nextRecommendedMaintenanceDate?: string
  }): Promise<string> {
    const response = await axios.post<{ id: string }>(`${this.baseUrl}/create`, data)
    return response.data.id
  }

  async updateMaintenance(
    id: string,
    data: {
      status?: MaintenanceStatus
      technicianId?: string
      type?: MaintenanceType
      replacedParts?: string[]
      cost?: number
      technicalRecommendations?: string
      workDescription?: string
      nextRecommendedMaintenanceDate?: string
    },
  ): Promise<void> {
    await axios.put(`${this.baseUrl}/update/${id}`, data)
  }

  async updateMaintenanceKilometers(data: {
    maintenanceId: string
    newKilometers: number
  }): Promise<void> {
    await axios.put(`${this.baseUrl}/update-kilometers/${data.maintenanceId}`, {
      newKilometers: data.newKilometers
    })
  }

  async deleteMaintenance(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`)
  }

  async getMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}`)
    return response.data.map(this.transformMaintenance)
  }

  async getMaintenancesByBike(bikeId: string): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}/bike/${bikeId}`)
    return response.data.map(this.transformMaintenance)
  }

  async getMaintenancesByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}/status/${status}`)
    return response.data.map(this.transformMaintenance)
  }

  async getScheduledMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}/scheduled`)
    return response.data.map(this.transformMaintenance)
  }

  async getCompletedMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}/completed`)
    return response.data.map(this.transformMaintenance)
  }

  async getDueMaintenances(): Promise<Maintenance[]> {
    const response = await axios.get<RawMaintenance[]>(`${this.baseUrl}/due-maintenances`)
    return response.data.map(this.transformMaintenance)
  }

  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    const response = await axios.get<MaintenanceNotification[]>(`${this.baseUrl}/notifications/pending`)
    return response.data
  }

  async getLowStockNotifications(): Promise<MaintenanceNotification[]> {
    return sparePartsService.getLowStockNotifications()
  }

  async acknowledgeNotification(id: string, type: NotificationType): Promise<void> {
    if (type === NotificationType.MAINTENANCE) {
      await axios.put(`${this.baseUrl}/notifications/${id}/acknowledge`)
    } else {
      await sparePartsService.acknowledgeNotification(id)
    }
  }
}

export const maintenanceService = new MaintenanceService()
