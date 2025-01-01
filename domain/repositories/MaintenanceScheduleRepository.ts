import { MaintenanceSchedule } from "../entities/MaintenanceSchedule";

export interface MaintenanceScheduleRepository {
  save(schedule: MaintenanceSchedule): Promise<void>;
  findById(id: string): Promise<MaintenanceSchedule | null>;
  findByBikeModelId(bikeModelId: string): Promise<MaintenanceSchedule[]>;
  findAll(): Promise<MaintenanceSchedule[]>;
  delete(id: string): Promise<void>;
  findDueMaintenances(): Promise<MaintenanceSchedule[]>;
}
