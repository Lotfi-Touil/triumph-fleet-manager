import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../ports/repositories/MaintenanceRepository";

export class GetDueMaintenances {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(): Promise<Maintenance[]> {
    return this.maintenanceRepository.findDueMaintenances();
  }
}
