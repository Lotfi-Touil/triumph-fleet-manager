import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { CreateBike } from '@application/usecases/CreateBike';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { Maintenance } from '@domain/entities/Maintenance';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification';
import { MaintenanceNotificationRepository } from '@domain/repositories/MaintenanceNotificationRepository';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import {
  MAINTENANCE_NOTIFICATION_REPOSITORY,
  BIKE_REPOSITORY,
} from './maintenance.constants';
import { Bike } from '@domain/entities/Bike';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject(CreateBike)
    private readonly createBikeUseCase: CreateBike,
    @Inject(CreateMaintenance)
    private readonly createMaintenanceUseCase: CreateMaintenance,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
    @Inject(MAINTENANCE_NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: MaintenanceNotificationRepository,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
  ) {}

  @Get('bikes')
  async getBikes(): Promise<Bike[]> {
    return this.bikeRepository.findAll();
  }

  @Post('bikes')
  async createBike(
    @Body()
    request: {
      id: string;
      name: string;
      maintenanceKilometers: number;
      maintenanceMonths: number;
    },
  ): Promise<void> {
    await this.createBikeUseCase.execute(request);
  }

  @Post('maintenances')
  async createMaintenance(
    @Body()
    request: {
      id: string;
      bikeId: string;
      lastMaintenanceDate: string;
      lastMaintenanceKilometers: number;
      currentKilometers: number;
    },
  ): Promise<void> {
    await this.createMaintenanceUseCase.execute({
      ...request,
      lastMaintenanceDate: new Date(request.lastMaintenanceDate),
    });
  }

  @Get('due')
  async getDueMaintenances(): Promise<Maintenance[]> {
    return this.getDueMaintenancesUseCase.execute();
  }

  @Get('notifications')
  async getNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findAll();
  }

  @Get('notifications/pending')
  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findPending();
  }

  @Put('notifications/:id/acknowledge')
  async acknowledgeNotification(@Param('id') id: string): Promise<void> {
    await this.notificationRepository.acknowledge(id);
  }
}
