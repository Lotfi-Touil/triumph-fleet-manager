import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { MaintenanceScheduleEntity } from './maintenance-schedule.entity';

@Entity('bike_models')
export class BikeModelEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  maintenanceKilometers: number;

  @Column()
  maintenanceMonths: number;

  @OneToMany(() => MaintenanceScheduleEntity, (schedule) => schedule.bikeModel)
  maintenanceSchedules: MaintenanceScheduleEntity[];
}
