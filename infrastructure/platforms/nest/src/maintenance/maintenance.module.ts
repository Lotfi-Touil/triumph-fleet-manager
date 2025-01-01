import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BikeModelEntity } from '../entities/bike-model.entity';
import { MaintenanceScheduleEntity } from '../entities/maintenance-schedule.entity';
import { MaintenanceController } from './maintenance.controller';
import { PostgresBikeModelRepository } from '@infrastructure/adapters/repositories/PostgresBikeModelRepository';
import { PostgresMaintenanceScheduleRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceScheduleRepository';
import { CreateBikeModel } from '@application/usecases/CreateBikeModel';
import { CreateMaintenanceSchedule } from '@application/usecases/CreateMaintenanceSchedule';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import {
  BIKE_MODEL_REPOSITORY,
  MAINTENANCE_SCHEDULE_REPOSITORY,
} from './maintenance.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([BikeModelEntity, MaintenanceScheduleEntity]),
  ],
  controllers: [MaintenanceController],
  providers: [
    {
      provide: BIKE_MODEL_REPOSITORY,
      useClass: PostgresBikeModelRepository,
    },
    {
      provide: MAINTENANCE_SCHEDULE_REPOSITORY,
      useFactory: (bikeModelRepo, repository) => {
        return new PostgresMaintenanceScheduleRepository(
          repository,
          bikeModelRepo,
        );
      },
      inject: [
        BIKE_MODEL_REPOSITORY,
        getRepositoryToken(MaintenanceScheduleEntity),
      ],
    },
    {
      provide: CreateBikeModel,
      useFactory: (bikeModelRepo) => new CreateBikeModel(bikeModelRepo),
      inject: [BIKE_MODEL_REPOSITORY],
    },
    {
      provide: CreateMaintenanceSchedule,
      useFactory: (maintenanceScheduleRepo, bikeModelRepo) =>
        new CreateMaintenanceSchedule(maintenanceScheduleRepo, bikeModelRepo),
      inject: [MAINTENANCE_SCHEDULE_REPOSITORY, BIKE_MODEL_REPOSITORY],
    },
    {
      provide: GetDueMaintenances,
      useFactory: (maintenanceScheduleRepo) =>
        new GetDueMaintenances(maintenanceScheduleRepo),
      inject: [MAINTENANCE_SCHEDULE_REPOSITORY],
    },
  ],
  exports: [BIKE_MODEL_REPOSITORY, MAINTENANCE_SCHEDULE_REPOSITORY],
})
export class MaintenanceModule {}
