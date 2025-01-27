import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreakdownRepository } from '@domain/repositories/BreakdownRepository';
import { Breakdown, BreakdownStatus, BreakdownType } from '@domain/entities/Breakdown';
import { BreakdownEntity } from '../entities/breakdown.entity';
import { BikeEntity } from '../entities/bike.entity';
import { Bike } from '@domain/entities/Bike';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';

@Injectable()
export class PostgresBreakdownRepository implements BreakdownRepository {
  constructor(
    @InjectRepository(BreakdownEntity)
    private readonly repository: Repository<BreakdownEntity>,
    @InjectRepository(BikeEntity)
    private readonly bikeRepository: Repository<BikeEntity>,
  ) {}

  async save(breakdown: Breakdown): Promise<void> {
    const bikeEntity = await this.bikeRepository.findOne({ where: { id: breakdown.getBike().getId() } });
    if (!bikeEntity) {
      throw new Error('Bike not found');
    }

    const entity = new BreakdownEntity();
    entity.id = breakdown.getId();
    entity.bike = bikeEntity;
    entity.description = breakdown.getDescription();
    entity.type = breakdown.getType();
    entity.status = breakdown.getStatus();
    entity.reportDate = breakdown.getReportDate();
    entity.resolutionDate = breakdown.getResolutionDate();
    entity.warrantyApplied = breakdown.isWarrantyApplied();
    entity.repairActions = breakdown.getRepairActions();
    entity.technicalRecommendations = breakdown.getTechnicalRecommendations();
    entity.cost = breakdown.getCost();
    entity.replacedParts = breakdown.getReplacedParts();

    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Breakdown | null> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['bike']
    });
    if (!entity) {
      return null;
    }
    return this.toDomain(entity);
  }

  async findByBikeId(bikeId: string): Promise<Breakdown[]> {
    const entities = await this.repository.find({
      where: { bike: { id: bikeId } },
      relations: ['bike']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findAll(): Promise<Breakdown[]> {
    const entities = await this.repository.find({ relations: ['bike'] });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByStatus(status: BreakdownStatus): Promise<Breakdown[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ['bike']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findUnresolved(): Promise<Breakdown[]> {
    const entities = await this.repository.find({
      where: { status: BreakdownStatus.REPORTED },
      relations: ['bike']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findWarrantyCovered(): Promise<Breakdown[]> {
    const entities = await this.repository.find({
      where: { warrantyApplied: true },
      relations: ['bike']
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: BreakdownEntity): Breakdown {
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

    return new Breakdown(
      entity.id,
      bike,
      entity.description,
      entity.type as BreakdownType,
      entity.status as BreakdownStatus,
      entity.reportDate,
      entity.resolutionDate,
      entity.warrantyApplied,
      entity.repairActions,
      entity.technicalRecommendations,
      entity.cost,
      entity.replacedParts
    );
  }
} 