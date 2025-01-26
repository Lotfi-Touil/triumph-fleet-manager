import { MaintenanceRepository } from '@domain/repositories/MaintenanceRepository'

export class DeleteMaintenance {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(id: string): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(id)
    if (!maintenance) {
      throw new Error('Maintenance not found')
    }

    await this.maintenanceRepository.delete(id)
  }
} 