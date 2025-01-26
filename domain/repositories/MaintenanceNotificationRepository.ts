import { MaintenanceNotification } from "../entities/MaintenanceNotification";

export interface MaintenanceNotificationRepository {
  save(notification: MaintenanceNotification): Promise<void>;
  findById(id: string): Promise<MaintenanceNotification | null>;
  findAll(): Promise<MaintenanceNotification[]>;
  findPending(): Promise<MaintenanceNotification[]>;
  acknowledge(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
