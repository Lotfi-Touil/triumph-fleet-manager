import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BikeEntity } from './bike.entity';
import { UserEntity } from './user.entity';

@Entity('maintenances')
export class MaintenanceEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'bike_id' })
  bikeId: string;

  @ManyToOne(() => BikeEntity)
  @JoinColumn({ name: 'bike_id' })
  bike: BikeEntity;

  @Column({ name: 'technician_id', nullable: true })
  technicianId: string | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'technician_id' })
  technician: UserEntity | null;

  @Column({ name: 'last_maintenance_date' })
  lastMaintenanceDate: Date;

  @Column({ name: 'last_maintenance_kilometers' })
  lastMaintenanceKilometers: number;

  @Column({ name: 'current_kilometers' })
  currentKilometers: number;
} 
