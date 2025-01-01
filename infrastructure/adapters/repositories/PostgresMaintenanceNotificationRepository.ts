import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  MaintenanceNotification,
  NotificationStatus,
} from "../../../domain/entities/MaintenanceNotification";
import { MaintenanceNotificationRepository } from "../../../domain/repositories/MaintenanceNotificationRepository";
import { MaintenanceNotificationEntity } from "../../platforms/nest/src/entities/maintenance-notification.entity";
import { MaintenanceScheduleRepository } from "../../../domain/repositories/MaintenanceScheduleRepository";

@Injectable()
export class PostgresMaintenanceNotificationRepository
  implements MaintenanceNotificationRepository
{
  constructor(
    @InjectRepository(MaintenanceNotificationEntity)
    private readonly repository: Repository<MaintenanceNotificationEntity>,
    private readonly maintenanceScheduleRepository: MaintenanceScheduleRepository
  ) {}

  async save(notification: MaintenanceNotification): Promise<void> {
    const entity = new MaintenanceNotificationEntity();
    entity.id = notification.getId();
    entity.maintenanceScheduleId = notification
      .getMaintenanceSchedule()
      .getId();
    entity.message = notification.getMessage();
    entity.status = notification.getStatus();
    entity.createdAt = notification.getCreatedAt();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<MaintenanceNotification | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByMaintenanceScheduleId(
    scheduleId: string
  ): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find({
      where: { maintenanceScheduleId: scheduleId },
    });
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async findPendingNotifications(): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find({
      where: { status: NotificationStatus.PENDING },
    });
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async findAll(): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find();
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private async toDomain(
    entity: MaintenanceNotificationEntity
  ): Promise<MaintenanceNotification> {
    const schedule = await this.maintenanceScheduleRepository.findById(
      entity.maintenanceScheduleId
    );
    if (!schedule) {
      throw new Error("Maintenance schedule not found");
    }

    return new MaintenanceNotification(
      entity.id,
      schedule,
      entity.createdAt,
      entity.status,
      entity.message
    );
  }
}
