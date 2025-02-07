import type { Driver } from './driver'
import type { Bike } from './bike'

export interface Trial {
  id: string
  driver: Driver
  bike: Bike
  startDate: Date
  endDate: Date | null
  duration: number | null
  notes: string
}

export interface CreateTrialDTO {
  driverId: string
  bikeId: string
  startDate: Date
  notes?: string
}

export interface UpdateTrialDTO {
  endDate: Date
  notes?: string
} 