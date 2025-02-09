import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Maintenance, MaintenanceStatus, MaintenanceType } from "../../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../../application/ports/repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../platforms/nest/src/entities/maintenance.entity";
import { BikeEntity } from "../../platforms/nest/src/entities/bike.entity";
import { Bike } from "../../../domain/entities/Bike";
import { MaintenanceInterval } from "../../../domain/value-objects/MaintenanceInterval";
import { User } from "../../../domain/entities/User";
import { UserEntity } from "../../platforms/nest/src/entities/user.entity";

@Injectable()
export class PostgresMaintenanceRepository implements MaintenanceRepository {
  constructor(
    @InjectRepository(MaintenanceEntity)
    private readonly repository: Repository<MaintenanceEntity>,
    @InjectRepository(BikeEntity)
    private readonly bikeRepository: Repository<BikeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async save(maintenance: Maintenance): Promise<void> {
    const bikeEntity = await this.bikeRepository.findOne({ where: { id: maintenance.getBike().getId() } });
    if (!bikeEntity) {
      throw new Error('Bike not found');
    }

    let technicianEntity = null;
    if (maintenance.getTechnician()) {
      technicianEntity = await this.userRepository.findOne({ where: { id: maintenance.getTechnician()?.getId() } });
      if (!technicianEntity) {
        throw new Error('Technician not found');
      }
    }

    const entity = new MaintenanceEntity();
    entity.id = maintenance.getId();
    entity.bike = bikeEntity;
    entity.maintenanceDate = maintenance.getMaintenanceDate();
    entity.lastMaintenanceKilometers = maintenance.getLastMaintenanceKilometers();
    entity.currentKilometers = maintenance.getCurrentKilometers();
    entity.technician = technicianEntity;
    entity.status = maintenance.getStatus();
    entity.type = maintenance.getType();
    entity.replacedParts = maintenance.getReplacedParts();
    entity.cost = maintenance.getCost();
    entity.technicalRecommendations = maintenance.getTechnicalRecommendations();
    entity.workDescription = maintenance.getWorkDescription();
    entity.nextRecommendedMaintenanceDate = maintenance.getNextRecommendedMaintenanceDate();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Maintenance | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['bike', 'technician']
    });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async findByBikeId(bikeId: string): Promise<Maintenance[]> {
    const entities = await this.repository.find({
      where: { bike: { id: bikeId } },
      relations: ['bike', 'technician']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findAll(): Promise<Maintenance[]> {
    const entities = await this.repository.find({ relations: ['bike', 'technician'] });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ['bike', 'technician']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findScheduled(): Promise<Maintenance[]> {
    const entities = await this.repository.find({
      where: { status: MaintenanceStatus.SCHEDULED },
      relations: ['bike', 'technician']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findCompleted(): Promise<Maintenance[]> {
    const entities = await this.repository.find({
      where: { status: MaintenanceStatus.COMPLETED },
      relations: ['bike', 'technician']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findDueMaintenances(): Promise<Maintenance[]> {
    const allMaintenances = await this.findAll();
    return allMaintenances.filter(maintenance => maintenance.isMaintenanceNeeded());
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: MaintenanceEntity): Maintenance {
    const maintenanceInterval = new MaintenanceInterval(
      entity.bike.maintenanceKilometers,
      entity.bike.maintenanceMonths
    );
    
    const bike = new Bike(
      entity.bike.id,
      entity.bike.name,
      entity.bike.registrationNumber,
      maintenanceInterval
    );

    let technician: User | null = null;
    if (entity.technician) {
      technician = new User({
        id: entity.technician.id,
        email: entity.technician.email,
        password: entity.technician.password,
        name: entity.technician.name,
        role: entity.technician.role,
        createdAt: entity.technician.createdAt,
        updatedAt: entity.technician.updatedAt
      });
    }

    return new Maintenance(
      entity.id,
      bike,
      entity.maintenanceDate,
      entity.lastMaintenanceKilometers,
      entity.currentKilometers,
      technician,
      entity.status as MaintenanceStatus,
      entity.type as MaintenanceType,
      entity.replacedParts,
      entity.cost,
      entity.technicalRecommendations,
      entity.workDescription,
      entity.nextRecommendedMaintenanceDate
    );
  }
}
