import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('drivers')
export class DriverEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: false })
  licenseNumber: string;

  @Column()
  licenseType: string;

  @Column()
  licenseExpiryDate: Date;

  @Column()
  experienceYears: number;

  @Column('text')
  drivingHistory: string;
} 