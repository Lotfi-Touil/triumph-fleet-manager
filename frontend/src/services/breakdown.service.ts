import axios from './axios'
import type { Bike } from './bike.service'

export enum BreakdownStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export enum BreakdownType {
  MECHANICAL = 'MECHANICAL',
  ELECTRICAL = 'ELECTRICAL',
  ELECTRONIC = 'ELECTRONIC',
  BODYWORK = 'BODYWORK',
  OTHER = 'OTHER',
}

export interface SparePart {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export interface BreakdownSparePart {
  id: string
  sparePartId: string
  quantity: number
  unitPrice: number
  details: SparePart
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
  spareParts: BreakdownSparePart[]
  totalCost: number
}

export interface SparePartRequest {
  sparePartId: string
  quantity: number
}

interface RawBreakdownSparePart {
  id: string
  sparePartId: string
  quantity: string | number
  unitPrice: string | number
  details: {
    id: string
    name: string
    price: string | number
    quantity: string | number
    category: string
  }
}

interface RawBreakdown {
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
  spareParts: RawBreakdownSparePart[]
  totalCost: string | number
}

class BreakdownService {
  private readonly baseUrl = '/breakdowns'

  private transformBreakdown(data: RawBreakdown): Breakdown {
    return {
      ...data,
      spareParts: data.spareParts.map((part: RawBreakdownSparePart) => ({
        ...part,
        quantity: Number(part.quantity),
        unitPrice: Number(part.unitPrice),
        details: {
          ...part.details,
          price: Number(part.details.price),
          quantity: Number(part.details.quantity),
        },
      })),
      totalCost: Number(data.totalCost),
    }
  }

  async createBreakdown(data: {
    bikeId: string
    description: string
    type: BreakdownType
    warrantyApplied: boolean
    spareParts?: SparePartRequest[]
  }): Promise<void> {
    await axios.post(`${this.baseUrl}/create`, data)
  }

  async updateBreakdown(
    id: string,
    data: {
      status?: BreakdownStatus
      repairActions?: string
      technicalRecommendations?: string
      spareParts?: SparePartRequest[]
      warrantyApplied?: boolean
    },
  ): Promise<void> {
    await axios.put(`${this.baseUrl}/update/${id}`, data)
  }

  async deleteBreakdown(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/delete/${id}`)
  }

  async getBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<RawBreakdown[]>(`${this.baseUrl}`)
    return response.data.map(this.transformBreakdown)
  }

  async getBreakdownsByBike(bikeId: string): Promise<Breakdown[]> {
    const response = await axios.get<RawBreakdown[]>(`${this.baseUrl}/bike/${bikeId}`)
    return response.data.map(this.transformBreakdown)
  }

  async getUnresolvedBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<RawBreakdown[]>(`${this.baseUrl}/unresolved`)
    return response.data.map(this.transformBreakdown)
  }

  async getWarrantyCoveredBreakdowns(): Promise<Breakdown[]> {
    const response = await axios.get<RawBreakdown[]>(`${this.baseUrl}/warranty`)
    return response.data.map(this.transformBreakdown)
  }

  async getBreakdownSpareParts(
    id: string,
  ): Promise<{ spareParts: BreakdownSparePart[]; totalCost: number }> {
    const response = await axios.get<{
      spareParts: RawBreakdownSparePart[]
      totalCost: string | number
    }>(`${this.baseUrl}/${id}/spare-parts`)
    return {
      spareParts: response.data.spareParts.map((part) => ({
        ...part,
        quantity: Number(part.quantity),
        unitPrice: Number(part.unitPrice),
        details: {
          ...part.details,
          price: Number(part.details.price),
          quantity: Number(part.details.quantity),
        },
      })),
      totalCost: Number(response.data.totalCost),
    }
  }
}

export const breakdownService = new BreakdownService()
