import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BikeEntity } from './bike.entity';
import { UserEntity } from './user.entity';
import { MaintenanceStatus, MaintenanceType } from '@domain/entities/Maintenance';

@Entity('maintenances')
export class MaintenanceEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => BikeEntity)
  @JoinColumn({ name: 'bike_id' })
  bike: BikeEntity;

  @Column({ type: 'timestamp' })
  maintenanceDate: Date;

  @Column({ name: 'last_maintenance_kilometers' })
  lastMaintenanceKilometers: number;

  @Column({ name: 'current_kilometers' })
  currentKilometers: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'technician_id' })
  technician: UserEntity | null;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus
  })
  status: MaintenanceStatus;

  @Column({
    type: 'enum',
    enum: MaintenanceType
  })
  type: MaintenanceType;

  @Column('simple-array')
  replacedParts: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column({ name: 'technical_recommendations', type: 'text' })
  technicalRecommendations: string;

  @Column({ name: 'work_description', type: 'text' })
  workDescription: string;

  @Column({ name: 'next_recommended_maintenance_date', type: 'timestamp', nullable: true })
  nextRecommendedMaintenanceDate: Date | null;
} 
