import { IsString, IsUUID, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrialDto {
  @IsUUID()
  driverId: string;

  @IsUUID()
  bikeId: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsString()
  @IsOptional()
  notes?: string;
} 