import { Maintenance, MaintenanceStatus, MaintenanceType } from '@domain/entities/Maintenance';
import { MaintenanceNotification } from '@domain/entities/MaintenanceNotification';

export interface CreateMaintenanceDTO {
  bikeId: string;
  maintenanceDate: Date;
  lastMaintenanceKilometers: number;
  currentKilometers: number;
  technicianId?: string;
  type: MaintenanceType;
  replacedParts?: string[];
  cost?: number;
  technicalRecommendations?: string;
  workDescription?: string;
  nextRecommendedMaintenanceDate?: Date;
}

export interface UpdateMaintenanceDTO {
  id: string;
  status?: MaintenanceStatus;
  technicianId?: string;
  type?: MaintenanceType;
  replacedParts?: string[];
  cost?: number;
  technicalRecommendations?: string;
  workDescription?: string;
  nextRecommendedMaintenanceDate?: Date;
}

export interface UpdateMaintenanceKilometersDTO {
  maintenanceId: string;
  newKilometers: number;
}

export interface MaintenanceService {
  createMaintenance(dto: CreateMaintenanceDTO): Promise<string>;
  updateMaintenance(dto: UpdateMaintenanceDTO): Promise<void>;
  updateMaintenanceKilometers(dto: UpdateMaintenanceKilometersDTO): Promise<void>;
  deleteMaintenance(id: string): Promise<void>;
  getAllMaintenances(): Promise<Maintenance[]>;
  getMaintenancesByBikeId(bikeId: string): Promise<Maintenance[]>;
  getMaintenancesByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
  getScheduledMaintenances(): Promise<Maintenance[]>;
  getCompletedMaintenances(): Promise<Maintenance[]>;
  getDueMaintenances(): Promise<Maintenance[]>;
  getMaintenanceNotifications(): Promise<MaintenanceNotification[]>;
  getPendingMaintenanceNotifications(): Promise<MaintenanceNotification[]>;
  acknowledgeMaintenanceNotification(id: string): Promise<void>;
} 