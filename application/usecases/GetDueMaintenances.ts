import { MaintenanceSchedule } from "../../domain/entities/MaintenanceSchedule";
import { MaintenanceScheduleRepository } from "../../domain/repositories/MaintenanceScheduleRepository";

export class GetDueMaintenances {
  constructor(
    private readonly maintenanceScheduleRepository: MaintenanceScheduleRepository
  ) {}

  async execute(): Promise<MaintenanceSchedule[]> {
    return this.maintenanceScheduleRepository.findDueMaintenances();
  }
}
