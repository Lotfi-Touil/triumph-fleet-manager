import { Injectable, Inject } from '@nestjs/common';
import { MaintenanceRepository } from '../ports/repositories/MaintenanceRepository'
import { MAINTENANCE_REPOSITORY } from '@infrastructure/platforms/nest/src/maintenance/maintenance.constants'

@Injectable()
export class DeleteMaintenance {
  constructor(
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  async execute(id: string): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(id)
    if (!maintenance) {
      throw new Error('Maintenance not found')
    }

    await this.maintenanceRepository.delete(id)
  }
} 