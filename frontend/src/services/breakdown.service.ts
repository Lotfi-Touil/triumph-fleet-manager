import axios from './axios'
import type { Bike } from './bike.service'

export enum BreakdownStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

export enum BreakdownType {
  MECHANICAL = 'MECHANICAL',
  ELECTRICAL = 'ELECTRICAL',
  ELECTRONIC = 'ELECTRONIC',
  BODYWORK = 'BODYWORK',
  OTHER = 'OTHER'
}

export interface Breakdown {
  id: string
  bike: Bike
  description: string
  type: BreakdownType
  status: BreakdownStatus
  reportDate: string
  resolutionDate: string | null
  warrantyApplied: boolean
  repairActions: string
  technicalRecommendations: string
  cost: number
  replacedParts: string[]
}

class BreakdownService {
  private readonly baseUrl = '/breakdown'

  async createBreakdown(data: {
    bikeId: string
    description: string
    type: BreakdownType
    warrantyApplied: boolean
  }): Promise<void> {
    await axios.post(`${this.baseUrl}/create-breakdown`, data)
  }

  async updateBreakdown(id: string, data: {
    status?: BreakdownStatus
    repairActions?: string
    technicalRecommendations?: string
    replacedParts?: string[]
    cost?: number
    warrantyApplied?: boolean
  }): Promise<void> {
    await axios.put(`${this.baseUrl}/update-breakdown/${id}`, data)
  }

  async deleteBreakdown(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete-breakdown/${id}`)
  }

  async getBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<Breakdown[]>(`${this.baseUrl}/breakdowns`)
    return response.data
  }

  async getBreakdownsByBike(bikeId: string): Promise<Breakdown[]> {
    const response = await axios.get<Breakdown[]>(`${this.baseUrl}/breakdowns/bike/${bikeId}`)
    return response.data
  }

  async getUnresolvedBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<Breakdown[]>(`${this.baseUrl}/breakdowns/unresolved`)
    return response.data
  }

  async getWarrantyCoveredBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<Breakdown[]>(`${this.baseUrl}/breakdowns/warranty`)
    return response.data
  }
}

export const breakdownService = new BreakdownService() 