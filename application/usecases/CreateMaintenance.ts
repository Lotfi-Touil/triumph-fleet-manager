import { Maintenance } from "../../domain/entities/Maintenance";
import { BikeRepository } from "../../domain/repositories/BikeRepository";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRole } from "../../domain/entities/User";

export interface CreateMaintenanceRequest {
  id: string;
  bikeId: string;
  technicianId: string | null;
  lastMaintenanceDate: Date;
  currentKilometers: number;
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
      if (technician.role !== UserRole.TECHNICIAN) {
        throw new Error("User is not a technician");
      }
    }

    const maintenance = new Maintenance(
      request.id,
      bike,
      request.lastMaintenanceDate,
      request.currentKilometers,
      request.currentKilometers,
      technician
    );

    await this.maintenanceRepository.save(maintenance);
  }
} 
