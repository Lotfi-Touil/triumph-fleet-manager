import {
  MaintenanceNotification,
  NotificationStatus,
} from "../../domain/entities/MaintenanceNotification";
import { MaintenanceNotificationRepository } from "../../domain/repositories/MaintenanceNotificationRepository";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";

export interface CreateMaintenanceNotificationRequest {
  id: string;
  maintenanceId: string;
  message: string;
}

export class CreateMaintenanceNotification {
  constructor(
    private readonly notificationRepository: MaintenanceNotificationRepository,
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  async execute(request: CreateMaintenanceNotificationRequest): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(
      request.maintenanceId
    );
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    const notification = new MaintenanceNotification(
      request.id,
      maintenance,
      new Date(),
      NotificationStatus.PENDING,
      request.message
    );

    await this.notificationRepository.save(notification);
  }
}
