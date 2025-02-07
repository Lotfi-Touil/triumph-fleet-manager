import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceEntity } from '../entities/maintenance.entity';
import { BikeEntity } from '../entities/bike.entity';
import { UserEntity } from '../entities/user.entity';
import { MaintenanceNotificationEntity } from '../entities/maintenance-notification.entity';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { UpdateMaintenance } from '@application/usecases/UpdateMaintenance';
import { GetMaintenances } from '@application/usecases/GetMaintenances';
import { DeleteMaintenance } from '@application/usecases/DeleteMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { GetMaintenanceNotifications } from '@application/usecases/GetMaintenanceNotifications';
import { GetPendingMaintenanceNotifications } from '@application/usecases/GetPendingMaintenanceNotifications';
import { AcknowledgeMaintenanceNotification } from '@application/usecases/AcknowledgeMaintenanceNotification';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';
import { PostgresMaintenanceRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceRepository';
import { PostgresBikeRepository } from '@infrastructure/adapters/repositories/PostgresBikeRepository';
import { PostgresUserRepository } from '@infrastructure/adapters/repositories/PostgresUserRepository';
import { PostgresMaintenanceNotificationRepository } from '@infrastructure/adapters/repositories/PostgresMaintenanceNotificationRepository';
import { MAINTENANCE_REPOSITORY, BIKE_REPOSITORY, USER_REPOSITORY, MAINTENANCE_NOTIFICATION_REPOSITORY } from './maintenance.constants';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceEntity, BikeEntity, UserEntity, MaintenanceNotificationEntity]),
    EventEmitterModule.forRoot()
  ],
  controllers: [MaintenanceController],
  providers: [
    {
      provide: CreateMaintenance,
      useFactory: (maintenanceRepo, bikeRepo, userRepo) => new CreateMaintenance(maintenanceRepo, bikeRepo, userRepo),
      inject: [MAINTENANCE_REPOSITORY, BIKE_REPOSITORY, USER_REPOSITORY],
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
      provide: CheckAndCreateMaintenanceNotifications,
      useFactory: (maintenanceRepo, notificationRepo, createNotification) => 
        new CheckAndCreateMaintenanceNotifications(maintenanceRepo, notificationRepo, createNotification),
      inject: [MAINTENANCE_REPOSITORY, MAINTENANCE_NOTIFICATION_REPOSITORY, CreateMaintenance],
    },
    {
      provide: UpdateMaintenance,
      useFactory: (maintenanceRepo, bikeRepo, userRepo) => new UpdateMaintenance(maintenanceRepo, bikeRepo, userRepo),
      inject: [MAINTENANCE_REPOSITORY, BIKE_REPOSITORY, USER_REPOSITORY],
    },
    {
      provide: GetMaintenances,
      useFactory: (maintenanceRepo) => new GetMaintenances(maintenanceRepo),
      inject: [MAINTENANCE_REPOSITORY],
    },
    {
      provide: DeleteMaintenance,
      useFactory: (maintenanceRepo) => new DeleteMaintenance(maintenanceRepo),
      inject: [MAINTENANCE_REPOSITORY],
    },
    {
      provide: GetDueMaintenances,
      useFactory: (maintenanceRepo) => new GetDueMaintenances(maintenanceRepo),
      inject: [MAINTENANCE_REPOSITORY],
    },
    {
      provide: MAINTENANCE_REPOSITORY,
      useClass: PostgresMaintenanceRepository,
    },
    {
      provide: BIKE_REPOSITORY,
      useClass: PostgresBikeRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PostgresUserRepository,
    },
    {
      provide: MAINTENANCE_NOTIFICATION_REPOSITORY,
      useFactory: (maintenanceNotificationRepo, maintenanceRepo) => 
        new PostgresMaintenanceNotificationRepository(maintenanceNotificationRepo, maintenanceRepo),
      inject: [getRepositoryToken(MaintenanceNotificationEntity), MAINTENANCE_REPOSITORY],
    }
  ],
  exports: [MAINTENANCE_REPOSITORY],
})
export class MaintenanceModule {}
