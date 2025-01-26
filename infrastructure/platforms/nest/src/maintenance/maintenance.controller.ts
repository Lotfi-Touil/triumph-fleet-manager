import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { Maintenance } from '@domain/entities/Maintenance';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification';
import { MaintenanceNotificationRepository } from '@domain/repositories/MaintenanceNotificationRepository';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import {
  MAINTENANCE_NOTIFICATION_REPOSITORY,
  BIKE_REPOSITORY,
  MAINTENANCE_REPOSITORY,
} from './maintenance.constants';
import { randomUUID } from 'crypto';
import { MaintenanceRepository } from '@domain/repositories/MaintenanceRepository';
import { IsString, IsNumber, IsDateString } from 'class-validator';

class CreateMaintenanceDto {
  @IsString()
  bikeId: string;

  @IsNumber()
  kilometers: number;

  @IsDateString()
  date: string;
}

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject(CreateMaintenance)
    private readonly createMaintenanceUseCase: CreateMaintenance,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
    @Inject(MAINTENANCE_NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: MaintenanceNotificationRepository,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  @Post('create-maintenance')
  async createMaintenance(@Body() request: CreateMaintenanceDto): Promise<void> {
    console.log('Creating maintenance with request:', request);
    
    const bike = await this.bikeRepository.findById(request.bikeId);
    console.log('Found bike:', bike);
    
    if (!bike) {
      throw new BadRequestException('Bike not found');
    }

    const lastMaintenances = await this.maintenanceRepository.findByBikeId(
      request.bikeId,
    );
    console.log('Last maintenances:', lastMaintenances);
    
    const lastMaintenance = lastMaintenances[lastMaintenances.length - 1];
    console.log('Last maintenance:', lastMaintenance);

    const maintenanceDate = new Date(request.date);
    if (isNaN(maintenanceDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    const payload = {
      id: randomUUID(),
      bikeId: request.bikeId,
      lastMaintenanceDate: maintenanceDate,
      lastMaintenanceKilometers: lastMaintenance ? lastMaintenance.getCurrentKilometers() : 0,
      currentKilometers: request.kilometers
    };
    console.log('Creating maintenance with payload:', payload);

    try {
      await this.createMaintenanceUseCase.execute(payload);
      console.log('Maintenance created successfully');
    } catch (error) {
      console.error('Error creating maintenance:', error);
      throw error;
    }
  }

  @Get('get-due-maintenances')
  async getDueMaintenances(): Promise<Maintenance[]> {
    return this.getDueMaintenancesUseCase.execute();
  }

  @Get('get-notifications')
  async getNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findAll();
  }

  @Get('get-pending-notifications')
  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    return this.notificationRepository.findPending();
  }

  @Put('acknowledge-notification/:id')
  async acknowledgeNotification(@Param('id') id: string): Promise<void> {
    await this.notificationRepository.acknowledge(id);
  }
}
