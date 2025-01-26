import { Maintenance } from '@domain/entities/Maintenance'
import { MaintenanceRepository } from '@domain/repositories/MaintenanceRepository'
import { BikeRepository } from '@domain/repositories/BikeRepository'

export interface UpdateMaintenanceRequest {
  id: string
  bikeId: string
  maintenanceDate: Date
  currentKilometers: number
}

export class UpdateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly bikeRepository: BikeRepository,
  ) {}

  async execute(request: UpdateMaintenanceRequest): Promise<void> {
    const bike = await this.bikeRepository.findById(request.bikeId)
    if (!bike) {
      throw new Error('Bike not found')
    }

    const maintenance = await this.maintenanceRepository.findById(request.id)
    if (!maintenance) {
      throw new Error('Maintenance not found')
    }

    const updatedMaintenance = new Maintenance(
      request.id,
      bike,
      request.maintenanceDate,
      0, // On met 0 par défaut car ce n'est pas utilisé
      request.currentKilometers,
    )

    await this.maintenanceRepository.save(updatedMaintenance)
  }
} 