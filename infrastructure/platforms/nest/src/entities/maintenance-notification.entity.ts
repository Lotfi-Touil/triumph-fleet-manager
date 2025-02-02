import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MaintenanceEntity } from './maintenance.entity';
import {
  NotificationStatus,
  NotificationType,
} from '@domain/entities/MaintenanceNotification';

@Entity('maintenance_notifications')
export class MaintenanceNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'maintenance_id' })
  maintenanceId: string;

  @ManyToOne(() => MaintenanceEntity)
  @JoinColumn({ name: 'maintenance_id' })
  maintenance: MaintenanceEntity;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.MAINTENANCE,
  })
  type: NotificationType;

  @Column()
  message: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
