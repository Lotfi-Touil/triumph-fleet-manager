import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { Kilometers } from "../../domain/value-objects/Kilometers";

export interface UpdateMaintenanceKilometersRequest {
  maintenanceId: string;
  newKilometers: number;
}

export class UpdateMaintenanceKilometers {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  async execute(request: UpdateMaintenanceKilometersRequest): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(
      request.maintenanceId
    );
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    // Valider les nouveaux kilomètres
    const newKilometers = new Kilometers(request.newKilometers);
    const lastMaintenanceKilometers = new Kilometers(maintenance.getLastMaintenanceKilometers());
    
    if (newKilometers.getValue() < lastMaintenanceKilometers.getValue()) {
      throw new Error("New kilometers cannot be less than last maintenance kilometers");
    }

    const updatedMaintenance = new Maintenance(
      maintenance.getId(),
      maintenance.getBike(),
      maintenance.getLastMaintenanceDate(),
      maintenance.getLastMaintenanceKilometers(),
      newKilometers.getValue()
    );

    await this.maintenanceRepository.save(updatedMaintenance);
  }
} 