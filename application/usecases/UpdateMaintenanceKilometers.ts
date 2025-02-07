import { Maintenance } from "../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../domain/repositories/MaintenanceRepository";
import { Kilometers } from "../../domain/value-objects/Kilometers";

export class UpdateMaintenanceKilometers {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenanceId: string, newKilometers: Kilometers): Promise<void> {
    const maintenance = await this.maintenanceRepository.findById(maintenanceId);
    if (!maintenance) {
      throw new Error("Maintenance not found");
    }

    const updatedMaintenance = new Maintenance(
      maintenance.getId(),
      maintenance.getBike(),
      maintenance.getMaintenanceDate(),
      maintenance.getLastMaintenanceKilometers(),
      newKilometers.getValue(),
      maintenance.getTechnician(),
      maintenance.getStatus(),
      maintenance.getType(),
      maintenance.getReplacedParts(),
      maintenance.getCost(),
      maintenance.getTechnicalRecommendations(),
      maintenance.getWorkDescription(),
      maintenance.getNextRecommendedMaintenanceDate()
    );

    await this.maintenanceRepository.save(updatedMaintenance);
  }
}
