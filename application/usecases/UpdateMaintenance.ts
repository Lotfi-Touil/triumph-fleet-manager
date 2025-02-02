import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { BikeRepository } from "../../domain/repositories/BikeRepository";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserRole } from "../../domain/entities/User";

export interface UpdateMaintenanceRequest {
  id: string;
  bikeId: string;
  technicianId: string | null;
  maintenanceDate: Date;
  currentKilometers: number;
}

export class UpdateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly bikeRepository: BikeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(request: UpdateMaintenanceRequest): Promise<void> {
    const bike = await this.bikeRepository.findById(request.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }

    const maintenance = await this.maintenanceRepository.findById(request.id);
    if (!maintenance) {
      throw new Error("Maintenance not found");
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

    const updatedMaintenance = new Maintenance(
      request.id,
      bike,
      request.maintenanceDate,
      request.currentKilometers,
      request.currentKilometers,
      technician
    );

    await this.maintenanceRepository.save(updatedMaintenance);
  }
}
