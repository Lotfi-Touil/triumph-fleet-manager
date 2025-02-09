import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification'
import { MaintenanceNotificationRepository } from '../ports/repositories/MaintenanceNotificationRepository'

export class GetMaintenanceNotifications {
  constructor(private readonly notificationRepository: MaintenanceNotificationRepository) {}

  async execute(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findAll()
  }
} 