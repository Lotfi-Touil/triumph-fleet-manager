import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification'
import { MaintenanceNotificationRepository } from '@domain/repositories/MaintenanceNotificationRepository'

export class GetPendingMaintenanceNotifications {
  constructor(private readonly notificationRepository: MaintenanceNotificationRepository) {}

  async execute(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findPending()
  }
} 