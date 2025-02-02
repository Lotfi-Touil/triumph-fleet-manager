import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Put,
  BadRequestException,
  Delete,
  Sse,
} from '@nestjs/common';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { GetMaintenanceNotifications } from '@application/usecases/GetMaintenanceNotifications';
import { GetPendingMaintenanceNotifications } from '@application/usecases/GetPendingMaintenanceNotifications';
import { AcknowledgeMaintenanceNotification } from '@application/usecases/AcknowledgeMaintenanceNotification';
import { UpdateMaintenance } from '@application/usecases/UpdateMaintenance';
import { DeleteMaintenance } from '@application/usecases/DeleteMaintenance';
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
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';

class CreateMaintenanceDto {
  @IsString()
  bikeId: string;

  @IsNumber()
  kilometers: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  technicianId?: string;
}

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject(CreateMaintenance)
    private readonly createMaintenanceUseCase: CreateMaintenance,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
    @Inject(GetMaintenanceNotifications)
    private readonly getMaintenanceNotificationsUseCase: GetMaintenanceNotifications,
    @Inject(GetPendingMaintenanceNotifications)
    private readonly getPendingMaintenanceNotificationsUseCase: GetPendingMaintenanceNotifications,
    @Inject(AcknowledgeMaintenanceNotification)
    private readonly acknowledgeMaintenanceNotificationUseCase: AcknowledgeMaintenanceNotification,
    @Inject(UpdateMaintenance)
    private readonly updateMaintenanceUseCase: UpdateMaintenance,
    @Inject(DeleteMaintenance)
    private readonly deleteMaintenanceUseCase: DeleteMaintenance,
    @Inject(MAINTENANCE_NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: MaintenanceNotificationRepository,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: MaintenanceRepository,
    @Inject(CheckAndCreateMaintenanceNotifications)
    private readonly checkAndCreateNotifications: CheckAndCreateMaintenanceNotifications,
    private eventEmitter: EventEmitter2,
  ) {}

  private async checkAndEmitNotifications(): Promise<void> {
    await this.checkAndCreateNotifications.execute();
    this.eventEmitter.emit('maintenance.notification');
  }

  @Post('create-maintenance')
  async createMaintenance(
    @Body() request: CreateMaintenanceDto,
  ): Promise<void> {
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
      technicianId: request.technicianId || null,
      lastMaintenanceDate: maintenanceDate,
      lastMaintenanceKilometers: lastMaintenance
        ? lastMaintenance.getCurrentKilometers()
        : 0,
      currentKilometers: request.kilometers,
    };
    console.log('Creating maintenance with payload:', payload);

    try {
      await this.createMaintenanceUseCase.execute(payload);
      await this.checkAndEmitNotifications();
      console.log('Maintenance created successfully');
    } catch (error) {
      console.error('Error creating maintenance:', error);
      throw error;
    }
  }

  @Put('update-maintenance/:id')
  async updateMaintenance(
    @Param('id') id: string,
    @Body()
    request: {
      bikeId: string;
      date: string;
      kilometers: number;
      technicianId?: string;
    },
  ): Promise<void> {
    await this.updateMaintenanceUseCase.execute({
      id,
      bikeId: request.bikeId,
      technicianId: request.technicianId || null,
      maintenanceDate: new Date(request.date),
      currentKilometers: request.kilometers,
    });
    await this.checkAndEmitNotifications();
  }

  @Delete('delete-maintenance/:id')
  async deleteMaintenance(@Param('id') id: string): Promise<void> {
    await this.deleteMaintenanceUseCase.execute(id);
    await this.checkAndEmitNotifications();
  }

  @Get('due-maintenances')
  async getDueMaintenances(): Promise<Maintenance[]> {
    return this.getDueMaintenancesUseCase.execute();
  }

  @Get('all-maintenances')
  async getAllMaintenances(): Promise<Maintenance[]> {
    return this.maintenanceRepository.findAll();
  }

  @Get('notifications')
  async getNotifications(): Promise<MaintenanceNotification[]> {
    return this.getMaintenanceNotificationsUseCase.execute();
  }

  @Get('notifications/pending')
  async getPendingNotifications(): Promise<MaintenanceNotification[]> {
    return this.getPendingMaintenanceNotificationsUseCase.execute();
  }

  @Sse('notifications/events')
  notificationEvents(): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      const listener = () => {
        subscriber.next({
          data: JSON.stringify({ type: 'NOTIFICATION_UPDATE' }),
        } as MessageEvent);
      };

      this.eventEmitter.on('maintenance.notification', listener);

      return () => {
        this.eventEmitter.off('maintenance.notification', listener);
      };
    });
  }

  @Put('notifications/:id/acknowledge')
  async acknowledgeNotification(@Param('id') id: string): Promise<void> {
    await this.acknowledgeMaintenanceNotificationUseCase.execute(id);
    this.eventEmitter.emit('maintenance.notification');
  }
}
