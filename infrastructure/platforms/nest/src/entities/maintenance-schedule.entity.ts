import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BikeModelEntity } from './bike-model.entity';

@Entity('maintenance_schedules')
export class MaintenanceScheduleEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'bike_model_id' })
  bikeModelId: string;

  @ManyToOne(() => BikeModelEntity)
  @JoinColumn({ name: 'bike_model_id' })
  bikeModel: BikeModelEntity;

  @Column({ name: 'last_maintenance_date' })
  lastMaintenanceDate: Date;

  @Column({ name: 'last_maintenance_kilometers' })
  lastMaintenanceKilometers: number;

  @Column({ name: 'current_kilometers' })
  currentKilometers: number;
}
