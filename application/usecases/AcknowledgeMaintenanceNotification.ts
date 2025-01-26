import { MaintenanceNotificationRepository } from '@domain/repositories/MaintenanceNotificationRepository'

export class AcknowledgeMaintenanceNotification {
  constructor(private readonly notificationRepository: MaintenanceNotificationRepository) {}

  async execute(id: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id)
    if (!notification) {
      throw new Error('Notification not found')
    }

    notification.acknowledge()
    await this.notificationRepository.save(notification)
  }
} 