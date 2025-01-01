import {
  MaintenanceNotification,
  NotificationStatus,
} from "../../domain/entities/MaintenanceNotification";
import { MaintenanceNotificationRepository } from "../../domain/repositories/MaintenanceNotificationRepository";
import { MaintenanceScheduleRepository } from "../../domain/repositories/MaintenanceScheduleRepository";

export interface CreateMaintenanceNotificationRequest {
  id: string;
  maintenanceScheduleId: string;
  message: string;
}

export class CreateMaintenanceNotification {
  constructor(
    private readonly notificationRepository: MaintenanceNotificationRepository,
    private readonly maintenanceScheduleRepository: MaintenanceScheduleRepository
  ) {}

  async execute(request: CreateMaintenanceNotificationRequest): Promise<void> {
    const schedule = await this.maintenanceScheduleRepository.findById(
      request.maintenanceScheduleId
    );

    if (!schedule) {
      throw new Error("Maintenance schedule not found");
    }

    const notification = new MaintenanceNotification(
      request.id,
      schedule,
      new Date(),
      NotificationStatus.PENDING,
      request.message
    );

    await this.notificationRepository.save(notification);
  }
}
