import { Injectable, Inject } from '@nestjs/common';
import { MaintenanceService, CreateMaintenanceDTO, UpdateMaintenanceDTO } from '@application/ports/services/MaintenanceService';
import { Maintenance, MaintenanceStatus } from '@domain/entities/Maintenance';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification';
import { CreateMaintenance } from '@application/usecases/CreateMaintenance';
import { UpdateMaintenance } from '@application/usecases/UpdateMaintenance';
import { DeleteMaintenance } from '@application/usecases/DeleteMaintenance';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { GetMaintenanceNotifications } from '@application/usecases/GetMaintenanceNotifications';
import { GetPendingMaintenanceNotifications } from '@application/usecases/GetPendingMaintenanceNotifications';
import { AcknowledgeMaintenanceNotification } from '@application/usecases/AcknowledgeMaintenanceNotification';
import { GetMaintenances } from '@application/usecases/GetMaintenances';
import { MaintenanceRepository } from '@domain/repositories/MaintenanceRepository';
import { MAINTENANCE_REPOSITORY } from './maintenance.constants';
import { randomUUID } from 'crypto';

@Injectable()
export class NestMaintenanceService implements MaintenanceService {
  constructor(
    @Inject(CreateMaintenance)
    private readonly createMaintenanceUseCase: CreateMaintenance,
    @Inject(UpdateMaintenance)
    private readonly updateMaintenanceUseCase: UpdateMaintenance,
    @Inject(DeleteMaintenance)
    private readonly deleteMaintenanceUseCase: DeleteMaintenance,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
    @Inject(GetMaintenanceNotifications)
    private readonly getMaintenanceNotificationsUseCase: GetMaintenanceNotifications,
    @Inject(GetPendingMaintenanceNotifications)
    private readonly getPendingMaintenanceNotificationsUseCase: GetPendingMaintenanceNotifications,
    @Inject(AcknowledgeMaintenanceNotification)
    private readonly acknowledgeMaintenanceNotificationUseCase: AcknowledgeMaintenanceNotification,
    @Inject(GetMaintenances)
    private readonly getMaintenancesUseCase: GetMaintenances,
    @Inject(MAINTENANCE_REPOSITORY)
    private readonly maintenanceRepository: MaintenanceRepository,
  ) {}

  async createMaintenance(dto: CreateMaintenanceDTO): Promise<string> {
    const maintenanceId = randomUUID();
    await this.createMaintenanceUseCase.execute({
      id: maintenanceId,
      ...dto
    });
    return maintenanceId;
  }

  async updateMaintenance(dto: UpdateMaintenanceDTO): Promise<void> {
    await this.updateMaintenanceUseCase.execute(dto);
  }

  async deleteMaintenance(id: string): Promise<void> {
    await this.deleteMaintenanceUseCase.execute(id);
  }

  async getAllMaintenances(): Promise<Maintenance[]> {
    return this.getMaintenancesUseCase.execute();
  }

  async getMaintenancesByBikeId(bikeId: string): Promise<Maintenance[]> {
    return this.getMaintenancesUseCase.executeByBikeId(bikeId);
  }

  async getMaintenancesByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    return this.getMaintenancesUseCase.executeByStatus(status);
  }

  async getScheduledMaintenances(): Promise<Maintenance[]> {
    return this.getMaintenancesUseCase.executeScheduled();
  }

  async getCompletedMaintenances(): Promise<Maintenance[]> {
    return this.getMaintenancesUseCase.executeCompleted();
  }

  async getDueMaintenances(): Promise<Maintenance[]> {
    return this.getDueMaintenancesUseCase.execute();
  }

  async getMaintenanceNotifications(): Promise<MaintenanceNotification[]> {
    return this.getMaintenanceNotificationsUseCase.execute();
  }

  async getPendingMaintenanceNotifications(): Promise<MaintenanceNotification[]> {
    return this.getPendingMaintenanceNotificationsUseCase.execute();
  }

  async acknowledgeMaintenanceNotification(id: string): Promise<void> {
    await this.acknowledgeMaintenanceNotificationUseCase.execute(id);
  }
} 