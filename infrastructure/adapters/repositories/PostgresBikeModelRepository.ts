import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BikeModel } from "../../../domain/entities/BikeModel";
import { BikeModelRepository } from "../../../domain/repositories/BikeModelRepository";
import { MaintenanceInterval } from "../../../domain/value-objects/MaintenanceInterval";
import { BikeModelEntity } from "../../platforms/nest/src/entities/bike-model.entity";

@Injectable()
export class PostgresBikeModelRepository implements BikeModelRepository {
  constructor(
    @InjectRepository(BikeModelEntity)
    private readonly repository: Repository<BikeModelEntity>
  ) {}

  async save(bikeModel: BikeModel): Promise<void> {
    const entity = new BikeModelEntity();
    entity.id = bikeModel.getId();
    entity.name = bikeModel.getName();
    entity.maintenanceKilometers = bikeModel
      .getMaintenanceInterval()
      .getKilometers();
    entity.maintenanceMonths = bikeModel
      .getMaintenanceInterval()
      .getMonthInterval();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findAll(): Promise<BikeModel[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: BikeModelEntity): BikeModel {
    const maintenanceInterval = new MaintenanceInterval(
      entity.maintenanceKilometers,
      entity.maintenanceMonths
    );

    return new BikeModel(entity.id, entity.name, maintenanceInterval);
  }
}
