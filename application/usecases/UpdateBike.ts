import { Bike } from "@domain/entities/Bike";
import { BikeRepository } from "@domain/repositories/BikeRepository";
import { MaintenanceInterval } from "@domain/value-objects/MaintenanceInterval";

export interface UpdateBikeRequest {
  id: string;
  name: string;
  maintenanceInterval: {
    kilometers: number;
    monthInterval: number;
  };
}

export class UpdateBike {
  constructor(private readonly bikeRepository: BikeRepository) {}

  async execute(request: UpdateBikeRequest): Promise<void> {
    const existingBike = await this.bikeRepository.findById(request.id);
    if (!existingBike) {
      throw new Error("Bike not found");
    }

    const maintenanceInterval = new MaintenanceInterval(
      request.maintenanceInterval.kilometers,
      request.maintenanceInterval.monthInterval
    );

    const updatedBike = new Bike(
      request.id,
      request.name,
      maintenanceInterval
    );

    await this.bikeRepository.save(updatedBike);
  }
} 