import { Maintenance } from "../entities/Maintenance";

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<void>;
  findById(id: string): Promise<Maintenance | null>;
  findByBikeId(bikeId: string): Promise<Maintenance[]>;
  findAll(): Promise<Maintenance[]>;
  delete(id: string): Promise<void>;
  findDueMaintenances(): Promise<Maintenance[]>;
} 