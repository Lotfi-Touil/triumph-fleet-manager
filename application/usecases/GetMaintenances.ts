import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { MaintenanceStatus } from "../../domain/entities/Maintenance";

export class GetMaintenances {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(): Promise<Maintenance[]> {
    return this.maintenanceRepository.findAll();
  }

  async executeByBikeId(bikeId: string): Promise<Maintenance[]> {
    return this.maintenanceRepository.findByBikeId(bikeId);
  }

  async executeByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    return this.maintenanceRepository.findByStatus(status);
  }

  async executeScheduled(): Promise<Maintenance[]> {
    return this.maintenanceRepository.findScheduled();
  }

  async executeCompleted(): Promise<Maintenance[]> {
    return this.maintenanceRepository.findCompleted();
  }
} 