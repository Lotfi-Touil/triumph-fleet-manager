import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrialService } from './trial.service';
import { TrialController } from './trial.controller';
import { Trial } from './trial.entity';
import { BikeEntity } from '../entities/bike.entity';
import { DriverEntity } from '../entities/driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trial, BikeEntity, DriverEntity]),
  ],
  controllers: [TrialController],
  providers: [TrialService],
  exports: [TrialService],
})
export class TrialModule {} 