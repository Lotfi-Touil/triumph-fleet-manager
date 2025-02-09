import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentEntity } from '../entities/incident.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateIncidentDTO, IncidentDTO, UpdateIncidentDTO, IncidentService } from '../../../../../application/ports/services/IncidentService';
import { Driver } from '../../../../../domain/entities/Driver';

@Injectable()
export class NestIncidentService implements IncidentService {
  constructor(
    @InjectRepository(IncidentEntity)
    private incidentRepository: Repository<IncidentEntity>,
  ) {}

  async findAll(): Promise<IncidentDTO[]> {
    const incidents = await this.incidentRepository.find({
      relations: ['driver'],
    });
    return incidents.map(incident => this.mapToDTO(incident));
  }

  async findOne(id: string): Promise<IncidentDTO> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['driver'],
    });
    return incident ? this.mapToDTO(incident) : null;
  }

  async findByDriver(driverId: string): Promise<IncidentDTO[]> {
    const incidents = await this.incidentRepository.find({
      where: { driverId },
      relations: ['driver'],
    });
    return incidents.map(incident => this.mapToDTO(incident));
  }

  async create(incident: CreateIncidentDTO): Promise<IncidentDTO> {
    const newIncident = this.incidentRepository.create({
      id: uuidv4(),
      ...incident,
    });
    const savedIncident = await this.incidentRepository.save(newIncident);
    return this.mapToDTO(savedIncident);
  }

  async update(id: string, incident: UpdateIncidentDTO): Promise<IncidentDTO> {
    await this.incidentRepository.update(id, incident);
    const updatedIncident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['driver'],
    });
    return updatedIncident ? this.mapToDTO(updatedIncident) : null;
  }

  async delete(id: string): Promise<void> {
    await this.incidentRepository.delete(id);
  }

  private mapToDTO(entity: IncidentEntity): IncidentDTO {
    const driver = entity.driver ? new Driver(
      entity.driver.id,
      entity.driver.firstName,
      entity.driver.lastName,
      entity.driver.email,
      entity.driver.phoneNumber,
      entity.driver.licenseNumber,
      entity.driver.licenseType,
      entity.driver.licenseExpiryDate,
      entity.driver.experienceYears,
      entity.driver.drivingHistory
    ) : undefined;

    return {
      id: entity.id,
      description: entity.description,
      date: entity.date,
      driverId: entity.driverId,
      driver: driver,
      location: entity.location,
      severity: entity.severity,
      status: entity.status,
    };
  }
} 