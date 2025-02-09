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
  USER_REPOSITORY,
} from './maintenance.constants';
import { randomUUID } from 'crypto';
import { MaintenanceRepository } from '@domain/repositories/MaintenanceRepository';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';
import { GetMaintenances } from '@application/usecases/GetMaintenances';
import { MaintenanceType, MaintenanceStatus } from '@domain/entities/Maintenance';
import { UserRepository } from '@domain/repositories/UserRepository';

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

interface MaintenanceResponse {
  id: string;
  bike: {
    id: string;
    name: string;
    registrationNumber: string;
  };
  maintenanceDate: string;
  lastMaintenanceKilometers: number;
  currentKilometers: number;
  technician: {
    id: string;
    name: string;
    email: string;
  } | null;
  status: MaintenanceStatus;
  type: MaintenanceType;
  replacedParts: string[];
  cost: number;
  technicalRecommendations: string;
  workDescription: string;
  nextRecommendedMaintenanceDate: string | null;
}

@Controller('maintenances')
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
    @Inject(GetMaintenances)
    private readonly getMaintenances: GetMaintenances,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  private async checkAndEmitNotifications(): Promise<void> {
    await this.checkAndCreateNotifications.execute();
    this.eventEmitter.emit('maintenance.notification');
  }

  @Post('create')
  async create(
    @Body()
    data: {
      bikeId: string;
      maintenanceDate: string;
      lastMaintenanceKilometers: number;
      currentKilometers: number;
      technicianId?: string;
      type: MaintenanceType;
      replacedParts?: string[];
      cost?: number;
      technicalRecommendations?: string;
      workDescription?: string;
      nextRecommendedMaintenanceDate?: string;
    },
  ) {
    const bike = await this.bikeRepository.findById(data.bikeId);
    if (!bike) {
      throw new BadRequestException('Bike not found');
    }

    const maintenanceId = randomUUID();

    await this.createMaintenanceUseCase.execute({
      id: maintenanceId,
      bikeId: data.bikeId,
      maintenanceDate: new Date(data.maintenanceDate),
      lastMaintenanceKilometers: data.lastMaintenanceKilometers,
      currentKilometers: data.currentKilometers,
      technicianId: data.technicianId,
      type: data.type,
      replacedParts: data.replacedParts,
      cost: data.cost,
      technicalRecommendations: data.technicalRecommendations,
      workDescription: data.workDescription,
      nextRecommendedMaintenanceDate: data.nextRecommendedMaintenanceDate ? new Date(data.nextRecommendedMaintenanceDate) : undefined
    });

    return { id: maintenanceId };
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body()
    data: {
      status?: MaintenanceStatus;
      technicianId?: string;
      type?: MaintenanceType;
      replacedParts?: string[];
      cost?: number;
      technicalRecommendations?: string;
      workDescription?: string;
      nextRecommendedMaintenanceDate?: string;
    },
  ) {
    return this.updateMaintenanceUseCase.execute({
      id,
      status: data.status,
      technicianId: data.technicianId,
      type: data.type,
      replacedParts: data.replacedParts,
      cost: data.cost,
      technicalRecommendations: data.technicalRecommendations,
      workDescription: data.workDescription,
      nextRecommendedMaintenanceDate: data.nextRecommendedMaintenanceDate ? new Date(data.nextRecommendedMaintenanceDate) : undefined
    });
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.deleteMaintenanceUseCase.execute(id);
  }

  @Get()
  async getAll(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.getMaintenances.execute();
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('bike/:bikeId')
  async getByBikeId(@Param('bikeId') bikeId: string): Promise<MaintenanceResponse[]> {
    const maintenances = await this.getMaintenances.executeByBikeId(bikeId);
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('status/:status')
  async getByStatus(@Param('status') status: MaintenanceStatus): Promise<MaintenanceResponse[]> {
    const maintenances = await this.getMaintenances.executeByStatus(status);
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('scheduled')
  async getScheduled(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.getMaintenances.executeScheduled();
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('completed')
  async getCompleted(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.getMaintenances.executeCompleted();
    return maintenances.map(maintenance => this.toResponse(maintenance));
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

  private toResponse(maintenance: any): MaintenanceResponse {
    const bike = maintenance.getBike();
    const technician = maintenance.getTechnician();

    return {
      id: maintenance.getId(),
      bike: {
        id: bike.getId(),
        name: bike.getName(),
        registrationNumber: bike.getRegistrationNumber(),
      },
      maintenanceDate: maintenance.getMaintenanceDate().toISOString(),
      lastMaintenanceKilometers: maintenance.getLastMaintenanceKilometers(),
      currentKilometers: maintenance.getCurrentKilometers(),
      technician: technician ? {
        id: technician.id,
        name: technician.name,
        email: technician.email,
      } : null,
      status: maintenance.getStatus(),
      type: maintenance.getType(),
      replacedParts: maintenance.getReplacedParts(),
      cost: maintenance.getCost(),
      technicalRecommendations: maintenance.getTechnicalRecommendations(),
      workDescription: maintenance.getWorkDescription(),
      nextRecommendedMaintenanceDate: maintenance.getNextRecommendedMaintenanceDate()?.toISOString() || null
    };
  }
}
