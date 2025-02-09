import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DriverEntity } from '../entities/driver.entity';
import { BikeEntity } from '../entities/bike.entity';
import { Transform, Type } from 'class-transformer';

@Entity()
export class Trial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DriverEntity, { eager: true })
  driver: DriverEntity;

  @ManyToOne(() => BikeEntity, { eager: true })
  bike: BikeEntity;

  @CreateDateColumn({ type: 'timestamp' })
  @Type(() => Date)
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Type(() => Date)
  @Transform(({ value }) => value ? new Date(value) : null)
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Type(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Type(() => Date)
  updatedAt: Date;
} 