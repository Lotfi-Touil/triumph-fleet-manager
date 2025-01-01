import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MaintenanceScheduleEntity } from './maintenance-schedule.entity';
import { NotificationStatus } from '@domain/entities/MaintenanceNotification';

@Entity('maintenance_notifications')
export class MaintenanceNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'maintenance_schedule_id' })
  maintenanceScheduleId: string;

  @ManyToOne(() => MaintenanceScheduleEntity)
  @JoinColumn({ name: 'maintenance_schedule_id' })
  maintenanceSchedule: MaintenanceScheduleEntity;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
