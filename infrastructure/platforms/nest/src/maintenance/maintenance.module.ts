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
import { UpdateBike } from '@application/usecases/UpdateBike';
import { DeleteBike } from '@application/usecases/DeleteBike';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { GetMaintenanceNotifications } from '@application/usecases/GetMaintenanceNotifications';
import { GetPendingMaintenanceNotifications } from '@application/usecases/GetPendingMaintenanceNotifications';
import { AcknowledgeMaintenanceNotification } from '@application/usecases/AcknowledgeMaintenanceNotification';
import { UpdateMaintenance } from '@application/usecases/UpdateMaintenance';
import { DeleteMaintenance } from '@application/usecases/DeleteMaintenance';
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
      useFactory: (repository) => new PostgresBikeRepository(repository),
      inject: [getRepositoryToken(BikeEntity)],
    },
    {
      provide: MAINTENANCE_REPOSITORY,
      useFactory: (repository, bikeRepo) => new PostgresMaintenanceRepository(repository, bikeRepo),
      inject: [getRepositoryToken(MaintenanceEntity), BIKE_REPOSITORY],
    },
    {
      provide: MAINTENANCE_NOTIFICATION_REPOSITORY,
      useFactory: (repository, maintenanceRepo) => new PostgresMaintenanceNotificationRepository(repository, maintenanceRepo),
      inject: [getRepositoryToken(MaintenanceNotificationEntity), MAINTENANCE_REPOSITORY],
    },
    {
      provide: CreateBike,
      useFactory: (bikeRepo) => new CreateBike(bikeRepo),
      inject: [BIKE_REPOSITORY],
    },
    {
      provide: UpdateBike,
      useFactory: (bikeRepo) => new UpdateBike(bikeRepo),
      inject: [BIKE_REPOSITORY],
    },
    {
      provide: DeleteBike,
      useFactory: (bikeRepo, maintenanceRepo) => new DeleteBike(bikeRepo, maintenanceRepo),
      inject: [BIKE_REPOSITORY, MAINTENANCE_REPOSITORY],
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
      provide: GetMaintenanceNotifications,
      useFactory: (notificationRepo) => new GetMaintenanceNotifications(notificationRepo),
      inject: [MAINTENANCE_NOTIFICATION_REPOSITORY],
    },
    {
      provide: GetPendingMaintenanceNotifications,
      useFactory: (notificationRepo) => new GetPendingMaintenanceNotifications(notificationRepo),
      inject: [MAINTENANCE_NOTIFICATION_REPOSITORY],
    },
    {
      provide: AcknowledgeMaintenanceNotification,
      useFactory: (notificationRepo) => new AcknowledgeMaintenanceNotification(notificationRepo),
      inject: [MAINTENANCE_NOTIFICATION_REPOSITORY],
    },
    {
      provide: UpdateMaintenance,
      useFactory: (maintenanceRepo, bikeRepo) => new UpdateMaintenance(maintenanceRepo, bikeRepo),
      inject: [MAINTENANCE_REPOSITORY, BIKE_REPOSITORY],
    },
    {
      provide: DeleteMaintenance,
      useFactory: (maintenanceRepo) => new DeleteMaintenance(maintenanceRepo),
      inject: [MAINTENANCE_REPOSITORY],
    },
    {
      provide: CreateMaintenanceNotification,
      useFactory: (notificationRepo, maintenanceRepo) => new CreateMaintenanceNotification(notificationRepo, maintenanceRepo),
      inject: [MAINTENANCE_NOTIFICATION_REPOSITORY, MAINTENANCE_REPOSITORY],
    },
    {
      provide: CheckAndCreateMaintenanceNotifications,
      useFactory: (maintenanceRepo, notificationRepo, createNotification) => 
        new CheckAndCreateMaintenanceNotifications(maintenanceRepo, notificationRepo, createNotification),
      inject: [MAINTENANCE_REPOSITORY, MAINTENANCE_NOTIFICATION_REPOSITORY, CreateMaintenanceNotification],
    },
  ],
  exports: [
    BIKE_REPOSITORY,
    MAINTENANCE_REPOSITORY,
    MAINTENANCE_NOTIFICATION_REPOSITORY,
  ],
})
export class MaintenanceModule {}
