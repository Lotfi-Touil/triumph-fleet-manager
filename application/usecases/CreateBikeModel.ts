import { BikeModel } from "../../domain/entities/BikeModel";
import { MaintenanceInterval } from "../../domain/value-objects/MaintenanceInterval";
import { BikeModelRepository } from "../../domain/repositories/BikeModelRepository";

export interface CreateBikeModelRequest {
  id: string;
  name: string;
  maintenanceKilometers: number;
  maintenanceMonths: number;
}

export class CreateBikeModel {
  constructor(private readonly bikeModelRepository: BikeModelRepository) {}

  async execute(request: CreateBikeModelRequest): Promise<void> {
    const maintenanceInterval = new MaintenanceInterval(
      request.maintenanceKilometers,
      request.maintenanceMonths
    );

    const bikeModel = new BikeModel(
      request.id,
      request.name,
      maintenanceInterval
    );

    await this.bikeModelRepository.save(bikeModel);
  }
}
