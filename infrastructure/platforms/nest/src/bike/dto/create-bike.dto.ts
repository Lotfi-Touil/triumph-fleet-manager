import { IsString, IsNotEmpty, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MaintenanceIntervalDTO {
  @IsNumber()
  @Min(0)
  kilometers: number;

  @IsNumber()
  @Min(0)
  monthInterval: number;
}

export class CreateBikeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ValidateNested()
  @Type(() => MaintenanceIntervalDTO)
  maintenanceInterval: MaintenanceIntervalDTO;
}