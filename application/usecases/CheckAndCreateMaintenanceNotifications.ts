import { MaintenanceRepository } from "../ports/repositories/MaintenanceRepository";
import { MaintenanceNotificationRepository } from "../ports/repositories/MaintenanceNotificationRepository";
import { CreateMaintenanceNotification } from "./CreateMaintenanceNotification";
import { v4 as uuidv4 } from "uuid";

export interface CheckAndCreateMaintenanceNotificationsRequest {
  maintenanceId: string;
}

export class CheckAndCreateMaintenanceNotifications {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly notificationRepository: MaintenanceNotificationRepository,
    private readonly createNotification: CreateMaintenanceNotification
  ) {}

  async execute(request: CheckAndCreateMaintenanceNotificationsRequest): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(request.maintenanceId);
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    if (maintenance.isMaintenanceNeeded()) {
      const existingNotifications = await this.notificationRepository.findByMaintenanceId(maintenance.getId());
      const hasNotification = existingNotifications.some(
        (notification) => notification.isPending()
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
