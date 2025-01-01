import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { CreateBikeModel } from '@application/usecases/CreateBikeModel';
import { CreateMaintenanceSchedule } from '@application/usecases/CreateMaintenanceSchedule';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { MaintenanceSchedule } from '@domain/entities/MaintenanceSchedule';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification';
import { MaintenanceNotificationRepository } from '@domain/repositories/MaintenanceNotificationRepository';
import { BikeModelRepository } from '@domain/repositories/BikeModelRepository';
import {
  MAINTENANCE_NOTIFICATION_REPOSITORY,
  BIKE_MODEL_REPOSITORY,
} from './maintenance.constants';
import { BikeModel } from '@domain/entities/BikeModel';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject(CreateBikeModel)
    private readonly createBikeModelUseCase: CreateBikeModel,
    @Inject(CreateMaintenanceSchedule)
    private readonly createMaintenanceScheduleUseCase: CreateMaintenanceSchedule,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
    @Inject(MAINTENANCE_NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: MaintenanceNotificationRepository,
    @Inject(BIKE_MODEL_REPOSITORY)
    private readonly bikeModelRepository: BikeModelRepository,
  ) {}

  @Get('bike-models')
  async getBikeModels(): Promise<BikeModel[]> {
    return this.bikeModelRepository.findAll();
  }

  @Post('bike-models')
  async createBikeModel(
    @Body()
    request: {
      id: string;
      name: string;
      maintenanceKilometers: number;
      maintenanceMonths: number;
    },
  ): Promise<void> {
    await this.createBikeModelUseCase.execute(request);
  }

  @Post('schedules')
  async createSchedule(
    @Body()
    request: {
      id: string;
      bikeModelId: string;
      lastMaintenanceDate: string;
      lastMaintenanceKilometers: number;
      currentKilometers: number;
    },
  ): Promise<void> {
    await this.createMaintenanceScheduleUseCase.execute({
      ...request,
      lastMaintenanceDate: new Date(request.lastMaintenanceDate),
    });
  }

  @Get('due')
  async getDueMaintenances(): Promise<MaintenanceSchedule[]> {
    return this.getDueMaintenancesUseCase.execute();
  }

  @Get('notifications')
  async getNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findAll();
  }

  @Get('notifications/pending')
  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findPendingNotifications();
  }

  @Put('notifications/:id/acknowledge')
  async acknowledgeNotification(@Param('id') id: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.acknowledge();
    await this.notificationRepository.save(notification);
  }
}
