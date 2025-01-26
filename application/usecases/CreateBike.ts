import { Bike } from "../../domain/entities/Bike";
import { MaintenanceInterval } from "../../domain/value-objects/MaintenanceInterval";
import { BikeRepository } from "../../domain/repositories/BikeRepository";

export interface CreateBikeRequest {
  id: string;
  name: string;
  maintenanceKilometers: number;
  maintenanceMonths: number;
}

export class CreateBike {
  constructor(private readonly bikeRepository: BikeRepository) {}

  async execute(request: CreateBikeRequest): Promise<void> {
    const maintenanceInterval = new MaintenanceInterval(
      request.maintenanceKilometers,
      request.maintenanceMonths
    );

    const bike = new Bike(
      request.id,
      request.name,
      maintenanceInterval
    );

    await this.bikeRepository.save(bike);
  }
} 