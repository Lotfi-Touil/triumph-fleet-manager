import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BreakdownEntity } from './breakdown.entity';

@Entity('breakdown_spare_parts')
export class BreakdownSparePartEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'breakdown_id' })
  breakdownId: string;

  @ManyToOne(() => BreakdownEntity)
  @JoinColumn({ name: 'breakdown_id' })
  breakdown: BreakdownEntity;

  @Column({ name: 'spare_part_id' })
  sparePartId: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
