import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrialController } from './trial.controller';
import { Trial } from './trial.entity';
import { BikeEntity } from '../entities/bike.entity';
import { DriverEntity } from '../entities/driver.entity';
import { TrialService } from '@application/ports/services/TrialService';
import { NestTrialService } from './trial.service';
import { TRIAL_SERVICE } from './trial.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trial, BikeEntity, DriverEntity])
  ],
  controllers: [TrialController],
  providers: [
    NestTrialService,
    {
      provide: TRIAL_SERVICE,
      useClass: NestTrialService,
    }
  ],
  exports: [TRIAL_SERVICE, NestTrialService],
})
export class TrialModule {} 