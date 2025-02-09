import { MaintenanceNotification } from "../../../domain/entities/MaintenanceNotification";

export interface MaintenanceNotificationRepository {
  save(notification: MaintenanceNotification): Promise<void>;
  findById(id: string): Promise<MaintenanceNotification | null>;
  findByMaintenanceId(maintenanceId: string): Promise<MaintenanceNotification[]>;
  findAll(): Promise<MaintenanceNotification[]>;
  findPending(): Promise<MaintenanceNotification[]>;
} 