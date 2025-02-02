import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DriverEntity } from './driver.entity';

@Entity('incidents')
export class IncidentEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  driverId: string;

  @ManyToOne(() => DriverEntity)
  @JoinColumn({ name: 'driverId' })
  driver: DriverEntity;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column()
  severity: string;

  @Column()
  status: string;
} 