import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Bike } from "@domain/entities/Bike";
import { BikeRepository } from "../../../application/ports/repositories/BikeRepository";
import { MaintenanceInterval } from "../../../domain/value-objects/MaintenanceInterval";
import { BikeEntity } from "../../platforms/nest/src/entities/bike.entity";

@Injectable()
export class PostgresBikeRepository implements BikeRepository {
  constructor(
    @InjectRepository(BikeEntity)
    private readonly repository: Repository<BikeEntity>
  ) {}

  async save(bike: Bike): Promise<void> {
    const entity = new BikeEntity();
    entity.id = bike.getId();
    entity.name = bike.getName();
    entity.registrationNumber = bike.getRegistrationNumber();
    entity.maintenanceKilometers = bike.getMaintenanceInterval().getKilometers();
    entity.maintenanceMonths = bike.getMaintenanceInterval().getMonthInterval();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Bike | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findAll(): Promise<Bike[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: BikeEntity): Bike {
    const maintenanceInterval = new MaintenanceInterval(
      entity.maintenanceKilometers,
      entity.maintenanceMonths
    );

    return new Bike(
      entity.id,
      entity.name,
      entity.registrationNumber,
      maintenanceInterval
    );
  }
} 