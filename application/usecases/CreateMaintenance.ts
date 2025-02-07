import { Maintenance, MaintenanceStatus, MaintenanceType } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { BikeRepository } from "../../domain/repositories/BikeRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";

export interface CreateMaintenanceRequest {
  id: string;
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

export class CreateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: CreateMaintenanceRequest): Promise<void> {
    const bike = await this.bikeRepository.findById(request.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }

    let technician = null;
    if (request.technicianId) {
      technician = await this.userRepository.findById(request.technicianId);
      if (!technician) {
        throw new Error("Technician not found");
      }
    }

    const maintenance = new Maintenance(
      request.id,
      bike,
      request.maintenanceDate,
      request.lastMaintenanceKilometers,
      request.currentKilometers,
      technician,
      MaintenanceStatus.SCHEDULED,
      request.type,
      request.replacedParts || [],
      request.cost || 0,
      request.technicalRecommendations || '',
      request.workDescription || '',
      request.nextRecommendedMaintenanceDate || null
    );

    await this.maintenanceRepository.save(maintenance);
  }
} 
