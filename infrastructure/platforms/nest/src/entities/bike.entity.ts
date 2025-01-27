import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { MaintenanceEntity } from './maintenance.entity';

@Entity('bikes')
export class BikeEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  registrationNumber: string;

  @Column()
  maintenanceKilometers: number;

  @Column()
  maintenanceMonths: number;

  @OneToMany(() => MaintenanceEntity, (maintenance) => maintenance.bike)
  maintenances: MaintenanceEntity[];
} 