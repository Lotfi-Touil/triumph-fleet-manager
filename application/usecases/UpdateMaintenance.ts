import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { BikeRepository } from "../../domain/repositories/BikeRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRole } from "../../domain/entities/User";
import { MaintenanceStatus, MaintenanceType } from "../../domain/entities/Maintenance";

export interface UpdateMaintenanceRequest {
  id: string;
  status?: MaintenanceStatus;
  technicianId?: string;
  type?: MaintenanceType;
  replacedParts?: string[];
  cost?: number;
  technicalRecommendations?: string;
  workDescription?: string;
  nextRecommendedMaintenanceDate?: Date | null;
}

export class UpdateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: UpdateMaintenanceRequest): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(request.id);
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    if (request.technicianId) {
      const technician = await this.userRepository.findById(request.technicianId);
      if (!technician) {
        throw new Error("Technician not found");
      }
      if (technician.role !== UserRole.TECHNICIAN) {
        throw new Error("User is not a technician");
      }
      maintenance.assignTechnician(technician);
    }

    if (request.status) {
      maintenance.updateStatus(request.status);
    }

    const details = {
      replacedParts: request.replacedParts ?? maintenance.getReplacedParts(),
      cost: request.cost ?? maintenance.getCost(),
      technicalRecommendations: request.technicalRecommendations ?? maintenance.getTechnicalRecommendations(),
      workDescription: request.workDescription ?? maintenance.getWorkDescription(),
      nextRecommendedMaintenanceDate: request.nextRecommendedMaintenanceDate ?? maintenance.getNextRecommendedMaintenanceDate()
    };

    maintenance.updateMaintenanceDetails(
      details.replacedParts,
      details.cost,
      details.technicalRecommendations,
      details.workDescription,
      details.nextRecommendedMaintenanceDate
    );

    await this.maintenanceRepository.save(maintenance);
  }
}
