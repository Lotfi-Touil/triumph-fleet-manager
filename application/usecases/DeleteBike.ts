import { BikeRepository } from "@domain/repositories/BikeRepository";
import { MaintenanceRepository } from "@domain/repositories/MaintenanceRepository";

export class DeleteBike {
  constructor(
    private readonly bikeRepository: BikeRepository,
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  async execute(id: string): Promise<void> {
    const bike = await this.bikeRepository.findById(id);
    if (!bike) {
      throw new Error("Bike not found");
    }

    const maintenances = await this.maintenanceRepository.findByBikeId(id);
    if (maintenances.length > 0) {
      throw new Error("Cannot delete bike with associated maintenances");
    }

    await this.bikeRepository.delete(id);
  }
} 