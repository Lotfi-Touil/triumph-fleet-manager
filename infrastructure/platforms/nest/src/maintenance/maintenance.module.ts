import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BikeModelEntity } from '../entities/bike-model.entity';
import { MaintenanceScheduleEntity } from '../entities/maintenance-schedule.entity';
import { MaintenanceNotificationEntity } from '../entities/maintenance-notification.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceCheckService } from './maintenance-check.service';
import { PostgresBikeModelRepository } from '@infrastructure/adapters/repositories/PostgresBikeModelRepository';
import { PostgresMaintenanceScheduleRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceScheduleRepository';
import { PostgresMaintenanceNotificationRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceNotificationRepository';
import { CreateBikeModel } from '@application/usecases/CreateBikeModel';
import { CreateMaintenanceSchedule } from '@application/usecases/CreateMaintenanceSchedule';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { CreateMaintenanceNotification } from '@application/usecases/CreateMaintenanceNotification';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';
import {
  BIKE_MODEL_REPOSITORY,
  MAINTENANCE_SCHEDULE_REPOSITORY,
  MAINTENANCE_NOTIFICATION_REPOSITORY,
} from './maintenance.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BikeModelEntity,
      MaintenanceScheduleEntity,
      MaintenanceNotificationEntity,
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceCheckService,
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
      provide: MAINTENANCE_NOTIFICATION_REPOSITORY,
      useFactory: (maintenanceScheduleRepo, repository) => {
        return new PostgresMaintenanceNotificationRepository(
          repository,
          maintenanceScheduleRepo,
        );
      },
      inject: [
        MAINTENANCE_SCHEDULE_REPOSITORY,
        getRepositoryToken(MaintenanceNotificationEntity),
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
    {
      provide: CreateMaintenanceNotification,
      useFactory: (notificationRepo, maintenanceScheduleRepo) =>
        new CreateMaintenanceNotification(
          notificationRepo,
          maintenanceScheduleRepo,
        ),
      inject: [
        MAINTENANCE_NOTIFICATION_REPOSITORY,
        MAINTENANCE_SCHEDULE_REPOSITORY,
      ],
    },
    {
      provide: CheckAndCreateMaintenanceNotifications,
      useFactory: (
        maintenanceScheduleRepo,
        notificationRepo,
        createNotification,
      ) =>
        new CheckAndCreateMaintenanceNotifications(
          maintenanceScheduleRepo,
          notificationRepo,
          createNotification,
        ),
      inject: [
        MAINTENANCE_SCHEDULE_REPOSITORY,
        MAINTENANCE_NOTIFICATION_REPOSITORY,
        CreateMaintenanceNotification,
      ],
    },
  ],
  exports: [
    BIKE_MODEL_REPOSITORY,
    MAINTENANCE_SCHEDULE_REPOSITORY,
    MAINTENANCE_NOTIFICATION_REPOSITORY,
  ],
})
export class MaintenanceModule {}
