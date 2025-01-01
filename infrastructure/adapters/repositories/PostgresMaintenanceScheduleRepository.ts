import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual } from "typeorm";
import { MaintenanceSchedule } from "../../../domain/entities/MaintenanceSchedule";
import { MaintenanceScheduleRepository } from "../../../domain/repositories/MaintenanceScheduleRepository";
import { MaintenanceScheduleEntity } from "../../platforms/nest/src/entities/maintenance-schedule.entity";
import { BikeModelRepository } from "../../../domain/repositories/BikeModelRepository";

@Injectable()
export class PostgresMaintenanceScheduleRepository
  implements MaintenanceScheduleRepository
{
  constructor(
    @InjectRepository(MaintenanceScheduleEntity)
    private readonly repository: Repository<MaintenanceScheduleEntity>,
    private readonly bikeModelRepository: BikeModelRepository
  ) {}

  async save(schedule: MaintenanceSchedule): Promise<void> {
    const entity = new MaintenanceScheduleEntity();
    entity.id = schedule.getId();
    entity.bikeModelId = schedule.getBikeModel().getId();
    entity.lastMaintenanceDate = schedule.getLastMaintenanceDate();
    entity.lastMaintenanceKilometers = schedule.getLastMaintenanceKilometers();
    entity.currentKilometers = schedule.getCurrentKilometers();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<MaintenanceSchedule | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByBikeModelId(bikeModelId: string): Promise<MaintenanceSchedule[]> {
    const entities = await this.repository.find({ where: { bikeModelId } });
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async findAll(): Promise<MaintenanceSchedule[]> {
    const entities = await this.repository.find();
    return Promise.all(entities.map((entity) => this.toDomain(entity)));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findDueMaintenances(): Promise<MaintenanceSchedule[]> {
    const allSchedules = await this.findAll();
    return allSchedules.filter((schedule) => schedule.isMaintenanceNeeded());
  }

  private async toDomain(
    entity: MaintenanceScheduleEntity
  ): Promise<MaintenanceSchedule> {
    const bikeModel = await this.bikeModelRepository.findById(
      entity.bikeModelId
    );
    if (!bikeModel) {
      throw new Error("Bike model not found");
    }

    return new MaintenanceSchedule(
      entity.id,
      bikeModel,
      entity.lastMaintenanceDate,
      entity.lastMaintenanceKilometers,
      entity.currentKilometers
    );
  }
}
