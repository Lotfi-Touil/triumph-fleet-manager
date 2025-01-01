import { MaintenanceScheduleRepository } from "../../domain/repositories/MaintenanceScheduleRepository";
import { MaintenanceNotificationRepository } from "../../domain/repositories/MaintenanceNotificationRepository";
import { CreateMaintenanceNotification } from "./CreateMaintenanceNotification";
import { v4 as uuidv4 } from "uuid";

export class CheckAndCreateMaintenanceNotifications {
  constructor(
    private readonly maintenanceScheduleRepository: MaintenanceScheduleRepository,
    private readonly notificationRepository: MaintenanceNotificationRepository,
    private readonly createNotificationUseCase: CreateMaintenanceNotification
  ) {}

  async execute(): Promise<void> {
    const dueMaintenances =
      await this.maintenanceScheduleRepository.findDueMaintenances();

    for (const schedule of dueMaintenances) {
      // Vérifier si une notification en attente existe déjà
      const existingNotifications =
        await this.notificationRepository.findByMaintenanceScheduleId(
          schedule.getId()
        );

      const hasPendingNotification = existingNotifications.some(
        (notification) => notification.getStatus() === "PENDING"
      );

      if (!hasPendingNotification) {
        const nextMaintenanceDate = schedule.getNextMaintenanceDate();
        const nextMaintenanceKm = schedule.getNextMaintenanceKilometers();
        const message =
          `L'entretien de votre ${schedule.getBikeModel().getName()} est dû. ` +
          `Prochain entretien prévu le ${nextMaintenanceDate.toLocaleDateString()} ` +
          `ou à ${nextMaintenanceKm} km.`;

        await this.createNotificationUseCase.execute({
          id: uuidv4(),
          maintenanceScheduleId: schedule.getId(),
          message,
        });
      }
    }
  }
}
