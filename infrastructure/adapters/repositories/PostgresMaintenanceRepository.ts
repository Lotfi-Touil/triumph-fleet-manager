import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Maintenance } from "../../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../../domain/repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../platforms/nest/src/entities/maintenance.entity";
import { BikeRepository } from "../../../domain/repositories/BikeRepository";

@Injectable()
export class PostgresMaintenanceRepository implements MaintenanceRepository {
  constructor(
    @InjectRepository(MaintenanceEntity)
    private readonly repository: Repository<MaintenanceEntity>,
    private readonly bikeRepository: BikeRepository
  ) {}

  async save(maintenance: Maintenance): Promise<void> {
    const entity = new MaintenanceEntity();
    entity.id = maintenance.getId();
    entity.bikeId = maintenance.getBike().getId();
    entity.lastMaintenanceDate = maintenance.getLastMaintenanceDate();
    entity.lastMaintenanceKilometers = maintenance.getLastMaintenanceKilometers();
    entity.currentKilometers = maintenance.getCurrentKilometers();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Maintenance | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByBikeId(bikeId: string): Promise<Maintenance[]> {
    const entities = await this.repository.find({ where: { bikeId } });
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async findAll(): Promise<Maintenance[]> {
    const entities = await this.repository.find();
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findDueMaintenances(): Promise<Maintenance[]> {
    const allMaintenances = await this.findAll();
    return allMaintenances.filter((maintenance) => maintenance.isMaintenanceNeeded());
  }

  private async toDomain(entity: MaintenanceEntity): Promise<Maintenance> {
    const bike = await this.bikeRepository.findById(entity.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }

    return new Maintenance(
      entity.id,
      bike,
      entity.lastMaintenanceDate,
      entity.lastMaintenanceKilometers,
      entity.currentKilometers
    );
  }
} 