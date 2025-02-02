import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentEntity } from '../entities/incident.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(IncidentEntity)
    private incidentRepository: Repository<IncidentEntity>,
  ) {}

  async findAll(): Promise<IncidentEntity[]> {
    return this.incidentRepository.find({
      relations: ['driver'],
    });
  }

  async findOne(id: string): Promise<IncidentEntity> {
    return this.incidentRepository.findOne({
      where: { id },
      relations: ['driver'],
    });
  }

  async findByDriver(driverId: string): Promise<IncidentEntity[]> {
    return this.incidentRepository.find({
      where: { driverId },
      relations: ['driver'],
    });
  }

  async create(incident: Omit<IncidentEntity, 'id'>): Promise<IncidentEntity> {
    const newIncident = this.incidentRepository.create({
      id: uuidv4(),
      ...incident,
    });
    return this.incidentRepository.save(newIncident);
  }

  async update(id: string, incident: Partial<IncidentEntity>): Promise<IncidentEntity> {
    await this.incidentRepository.update(id, incident);
    return this.incidentRepository.findOne({
      where: { id },
      relations: ['driver'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.incidentRepository.delete(id);
  }
} 