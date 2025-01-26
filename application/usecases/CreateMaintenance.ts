import { Maintenance } from "../../domain/entities/Maintenance";
import { BikeRepository } from "../../domain/repositories/BikeRepository";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";

export interface CreateMaintenanceRequest {
  id: string;
  bikeId: string;
  lastMaintenanceDate: Date;
  lastMaintenanceKilometers: number;
  currentKilometers: number;
}

export class CreateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly bikeRepository: BikeRepository
  ) {}

  async execute(request: CreateMaintenanceRequest): Promise<void> {
    const bike = await this.bikeRepository.findById(request.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }

    const maintenance = new Maintenance(
      request.id,
      bike,
      request.lastMaintenanceDate,
      request.lastMaintenanceKilometers,
      request.currentKilometers
    );

    await this.maintenanceRepository.save(maintenance);
  }
} 