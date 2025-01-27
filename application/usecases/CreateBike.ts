import { Bike } from "@domain/entities/Bike";
import { BikeRepository } from "@domain/repositories/BikeRepository";
import { MaintenanceInterval } from "@domain/value-objects/MaintenanceInterval";
import { v4 as uuidv4 } from 'uuid';

export interface CreateBikeRequest {
  name: string;
  registrationNumber: string;
  maintenanceInterval: {
    kilometers: number;
    monthInterval: number;
  };
}

export class CreateBike {
  constructor(private readonly bikeRepository: BikeRepository) {}

  async execute(request: CreateBikeRequest): Promise<void> {
    const maintenanceInterval = new MaintenanceInterval(
      request.maintenanceInterval.kilometers,
      request.maintenanceInterval.monthInterval
    );

    const bike = new Bike(
      uuidv4(),
      request.name,
      request.registrationNumber,
      maintenanceInterval
    );

    await this.bikeRepository.save(bike);
  }
} 