import { MaintenanceNotification } from "../entities/MaintenanceNotification";

export interface MaintenanceNotificationRepository {
  save(notification: MaintenanceNotification): Promise<void>;
  findById(id: string): Promise<MaintenanceNotification | null>;
  findByMaintenanceScheduleId(
    scheduleId: string
  ): Promise<MaintenanceNotification[]>;
  findPendingNotifications(): Promise<MaintenanceNotification[]>;
  findAll(): Promise<MaintenanceNotification[]>;
  delete(id: string): Promise<void>;
}
