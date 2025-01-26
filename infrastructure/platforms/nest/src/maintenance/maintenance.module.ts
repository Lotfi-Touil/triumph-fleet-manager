import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BikeEntity } from '../entities/bike.entity';
import { MaintenanceEntity } from '../entities/maintenance.entity';
import { MaintenanceNotificationEntity } from '../entities/maintenance-notification.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceCheckService } from './maintenance-check.service';
import { PostgresBikeRepository } from '@infrastructure/adapters/repositories/PostgresBikeRepository';
import { PostgresMaintenanceRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceRepository';
import { PostgresMaintenanceNotificationRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceNotificationRepository';
import { CreateBike } from '@application/usecases/CreateBike';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { CreateMaintenanceNotification } from '@application/usecases/CreateMaintenanceNotification';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';
import {
  BIKE_REPOSITORY,
  MAINTENANCE_REPOSITORY,
  MAINTENANCE_NOTIFICATION_REPOSITORY,
} from './maintenance.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BikeEntity,
      MaintenanceEntity,
      MaintenanceNotificationEntity,
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceCheckService,
    {
      provide: BIKE_REPOSITORY,
      useClass: PostgresBikeRepository,
    },
    {
      provide: MAINTENANCE_REPOSITORY,
      useFactory: (bikeRepo, repository) => {
        return new PostgresMaintenanceRepository(repository, bikeRepo);
      },
      inject: [BIKE_REPOSITORY, getRepositoryToken(MaintenanceEntity)],
    },
    {
      provide: MAINTENANCE_NOTIFICATION_REPOSITORY,
      useFactory: (maintenanceRepo, repository) => {
        return new PostgresMaintenanceNotificationRepository(
          repository,
          maintenanceRepo,
        );
      },
      inject: [
        MAINTENANCE_REPOSITORY,
        getRepositoryToken(MaintenanceNotificationEntity),
      ],
    },
    {
      provide: CreateBike,
      useFactory: (bikeRepo) => new CreateBike(bikeRepo),
      inject: [BIKE_REPOSITORY],
    },
    {
      provide: CreateMaintenance,
      useFactory: (maintenanceRepo, bikeRepo) =>
        new CreateMaintenance(maintenanceRepo, bikeRepo),
      inject: [MAINTENANCE_REPOSITORY, BIKE_REPOSITORY],
    },
    {
      provide: GetDueMaintenances,
      useFactory: (maintenanceRepo) => new GetDueMaintenances(maintenanceRepo),
      inject: [MAINTENANCE_REPOSITORY],
    },
    {
      provide: CreateMaintenanceNotification,
      useFactory: (notificationRepo, maintenanceRepo) =>
        new CreateMaintenanceNotification(notificationRepo, maintenanceRepo),
      inject: [
        MAINTENANCE_NOTIFICATION_REPOSITORY,
        MAINTENANCE_REPOSITORY,
      ],
    },
    {
      provide: CheckAndCreateMaintenanceNotifications,
      useFactory: (maintenanceRepo, notificationRepo, createNotification) =>
        new CheckAndCreateMaintenanceNotifications(
          maintenanceRepo,
          notificationRepo,
          createNotification,
        ),
      inject: [
        MAINTENANCE_REPOSITORY,
        MAINTENANCE_NOTIFICATION_REPOSITORY,
        CreateMaintenanceNotification,
      ],
    },
  ],
  exports: [
    BIKE_REPOSITORY,
    MAINTENANCE_REPOSITORY,
    MAINTENANCE_NOTIFICATION_REPOSITORY,
  ],
})
export class MaintenanceModule {}
