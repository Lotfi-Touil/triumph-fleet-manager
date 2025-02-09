import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceStatus } from "@domain/entities/Maintenance";

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<void>;
  findById(id: string): Promise<Maintenance | null>;
  findByBikeId(bikeId: string): Promise<Maintenance[]>;
  findAll(): Promise<Maintenance[]>;
  findByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
  findScheduled(): Promise<Maintenance[]>;
  findCompleted(): Promise<Maintenance[]>;
  findDueMaintenances(): Promise<Maintenance[]>;
  delete(id: string): Promise<void>;
} 