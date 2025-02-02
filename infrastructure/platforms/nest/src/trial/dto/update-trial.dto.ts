import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTrialDto {
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  notes?: string;
} 