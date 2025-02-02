import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BikeEntity } from './bike.entity';
import { BreakdownStatus, BreakdownType } from '@domain/entities/Breakdown';

@Entity('breakdowns')
export class BreakdownEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => BikeEntity)
  @JoinColumn({ name: 'bike_id' })
  bike: BikeEntity;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: BreakdownType,
    default: BreakdownType.MECHANICAL,
  })
  type: BreakdownType;

  @Column({
    type: 'enum',
    enum: BreakdownStatus,
    default: BreakdownStatus.REPORTED,
  })
  status: BreakdownStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  reportDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolutionDate: Date | null;

  @Column({ default: false })
  warrantyApplied: boolean;

  @Column({ nullable: true })
  repairActions: string;

  @Column({ nullable: true })
  technicalRecommendations: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column('simple-array', { default: '' })
  replacedParts: string[];
}
