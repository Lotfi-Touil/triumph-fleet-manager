import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  MaintenanceNotification,
  NotificationStatus,
} from "@domain/entities/MaintenanceNotification";
import { MaintenanceNotificationRepository } from "@application/ports/repositories/MaintenanceNotificationRepository";
import { MaintenanceNotificationEntity } from "../../platforms/nest/src/entities/maintenance-notification.entity";
import { MaintenanceRepository } from "@application/ports/repositories/MaintenanceRepository";

@Injectable()
export class PostgresMaintenanceNotificationRepository implements MaintenanceNotificationRepository
{
  constructor(
    @InjectRepository(MaintenanceNotificationEntity)
    private readonly repository: Repository<MaintenanceNotificationEntity>,
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  async save(notification: MaintenanceNotification): Promise<void> {
    const entity = new MaintenanceNotificationEntity();
    entity.id = notification.getId();
    entity.maintenanceId = notification.getMaintenance().getId();
    entity.status = notification.getStatus();
    entity.type = notification.getType();
    entity.message = notification.getMessage();
    entity.createdAt = notification.getCreatedAt();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<MaintenanceNotification | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['maintenance']
    });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findAll(): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find();
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async findPending(): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find({
      where: { status: NotificationStatus.PENDING },
      relations: ['maintenance'],
    });

    return Promise.all(entities.map(entity => this.toDomain(entity)));
  }

  async findByMaintenanceId(maintenanceId: string): Promise<MaintenanceNotification[]> {
    const entities = await this.repository.find({
      where: { maintenanceId },
    });

    return Promise.all(entities.map(entity => this.toDomain(entity)));
  }

  async acknowledge(id: string): Promise<void> {
    const notification = await this.findById(id);
    if (!notification) {
      throw new Error("Notification not found");
    }
    notification.acknowledge();
    await this.save(notification);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private async toDomain(
    entity: MaintenanceNotificationEntity
  ): Promise<MaintenanceNotification> {
    const maintenance = await this.maintenanceRepository.findById(
      entity.maintenanceId
    );
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    return new MaintenanceNotification(
      entity.id,
      maintenance,
      entity.createdAt,
      entity.status,
      entity.message,
      entity.type
    );
  }
}
