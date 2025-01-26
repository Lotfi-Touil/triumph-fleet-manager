import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { MaintenanceNotificationRepository } from "../../domain/repositories/MaintenanceNotificationRepository";
import { CreateMaintenanceNotification } from "./CreateMaintenanceNotification";
import { v4 as uuidv4 } from "uuid";

export class CheckAndCreateMaintenanceNotifications {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly notificationRepository: MaintenanceNotificationRepository,
    private readonly createNotification: CreateMaintenanceNotification
  ) {}

  async execute(): Promise<void> {
    const dueMaintenances = await this.maintenanceRepository.findDueMaintenances();

    for (const maintenance of dueMaintenances) {
      const existingNotifications = await this.notificationRepository.findAll();
      const hasNotification = existingNotifications.some(
        (notification) =>
          notification.getMaintenance().getId() === maintenance.getId() &&
          notification.isPending()
      );

      if (!hasNotification) {
        await this.createNotification.execute({
          id: uuidv4(),
          maintenanceId: maintenance.getId(),
          message: `La maintenance de la moto ${maintenance.getBike().getName()} est requise.`,
        });
      }
    }
  }
}
