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
import { MaintenanceService } from '@application/ports/services/MaintenanceService';
import { MaintenanceType, MaintenanceStatus } from '@domain/entities/Maintenance';
import { Observable } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

class CreateMaintenanceDto {
  @IsString()
  bikeId: string;

  @IsNumber()
  lastMaintenanceKilometers: number;

  @IsNumber()
  currentKilometers: number;

  @IsDateString()
  maintenanceDate: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  type: MaintenanceType;

  @IsString({ each: true })
  @IsOptional()
  replacedParts?: string[];

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  technicalRecommendations?: string;

  @IsString()
  @IsOptional()
  workDescription?: string;

  @IsDateString()
  @IsOptional()
  nextRecommendedMaintenanceDate?: string;
}

class UpdateKilometersDto {
  @IsNumber()
  newKilometers: number;
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
    @Inject('MaintenanceService')
    private readonly maintenanceService: MaintenanceService,
    @Inject(CheckAndCreateMaintenanceNotifications)
    private readonly checkAndCreateNotifications: CheckAndCreateMaintenanceNotifications,
    private eventEmitter: EventEmitter2,
  ) {}

  private async checkAndEmitNotifications(maintenanceId: string): Promise<void> {
    await this.checkAndCreateNotifications.execute({ maintenanceId });
    this.eventEmitter.emit('maintenance.notification');
  }

  @Post('create')
  async create(@Body() data: CreateMaintenanceDto) {
    const maintenanceId = await this.maintenanceService.createMaintenance({
      ...data,
      maintenanceDate: new Date(data.maintenanceDate),
      nextRecommendedMaintenanceDate: data.nextRecommendedMaintenanceDate ? new Date(data.nextRecommendedMaintenanceDate) : undefined
    });
    await this.checkAndEmitNotifications(maintenanceId);
    return { id: maintenanceId };
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: {
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
    await this.maintenanceService.updateMaintenance({
      id,
      ...data,
      nextRecommendedMaintenanceDate: data.nextRecommendedMaintenanceDate ? new Date(data.nextRecommendedMaintenanceDate) : undefined
    });
    await this.checkAndEmitNotifications(id);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    await this.maintenanceService.deleteMaintenance(id);
  }

  @Get()
  async getAll(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.maintenanceService.getAllMaintenances();
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('bike/:bikeId')
  async getByBikeId(@Param('bikeId') bikeId: string): Promise<MaintenanceResponse[]> {
    const maintenances = await this.maintenanceService.getMaintenancesByBikeId(bikeId);
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('status/:status')
  async getByStatus(@Param('status') status: MaintenanceStatus): Promise<MaintenanceResponse[]> {
    const maintenances = await this.maintenanceService.getMaintenancesByStatus(status);
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('scheduled')
  async getScheduled(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.maintenanceService.getScheduledMaintenances();
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('completed')
  async getCompleted(): Promise<MaintenanceResponse[]> {
    const maintenances = await this.maintenanceService.getCompletedMaintenances();
    return maintenances.map(maintenance => this.toResponse(maintenance));
  }

  @Get('due-maintenances')
  async getDueMaintenances() {
    return this.maintenanceService.getDueMaintenances();
  }

  @Get('notifications')
  async getNotifications() {
    return this.maintenanceService.getMaintenanceNotifications();
  }

  @Get('notifications/pending')
  async getPendingNotifications() {
    return this.maintenanceService.getPendingMaintenanceNotifications();
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
    await this.maintenanceService.acknowledgeMaintenanceNotification(id);
  }

  @Put('update-kilometers/:id')
  async updateKilometers(
    @Param('id') id: string,
    @Body() data: UpdateKilometersDto,
  ) {
    await this.maintenanceService.updateMaintenanceKilometers({
      maintenanceId: id,
      newKilometers: data.newKilometers,
    });
    await this.checkAndEmitNotifications(id);
  }

  private toResponse(maintenance: any): MaintenanceResponse {
    return {
      id: maintenance.id,
      bike: maintenance.bike,
      maintenanceDate: maintenance.maintenanceDate.toISOString(),
      lastMaintenanceKilometers: maintenance.lastMaintenanceKilometers,
      currentKilometers: maintenance.currentKilometers,
      technician: maintenance.technician,
      status: maintenance.status,
      type: maintenance.type,
      replacedParts: maintenance.replacedParts || [],
      cost: maintenance.cost || 0,
      technicalRecommendations: maintenance.technicalRecommendations || '',
      workDescription: maintenance.workDescription || '',
      nextRecommendedMaintenanceDate: maintenance.nextRecommendedMaintenanceDate?.toISOString() || null,
    };
  }
}
