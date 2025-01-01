import { MaintenanceSchedule } from "../../domain/entities/MaintenanceSchedule";
import { BikeModelRepository } from "../../domain/repositories/BikeModelRepository";
import { MaintenanceScheduleRepository } from "../../domain/repositories/MaintenanceScheduleRepository";

export interface CreateMaintenanceScheduleRequest {
  id: string;
  bikeModelId: string;
  lastMaintenanceDate: Date;
  lastMaintenanceKilometers: number;
  currentKilometers: number;
}

export class CreateMaintenanceSchedule {
  constructor(
    private readonly maintenanceScheduleRepository: MaintenanceScheduleRepository,
    private readonly bikeModelRepository: BikeModelRepository
  ) {}

  async execute(request: CreateMaintenanceScheduleRequest): Promise<void> {
    const bikeModel = await this.bikeModelRepository.findById(
      request.bikeModelId
    );
    if (!bikeModel) {
      throw new Error("Bike model not found");
    }

    const schedule = new MaintenanceSchedule(
      request.id,
      bikeModel,
      request.lastMaintenanceDate,
      request.lastMaintenanceKilometers,
      request.currentKilometers
    );

    await this.maintenanceScheduleRepository.save(schedule);
  }
}
