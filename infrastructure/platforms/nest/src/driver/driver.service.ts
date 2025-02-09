import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../entities/driver.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  DriverService,
  CreateDriverDTO,
  UpdateDriverDTO,
} from '@application/ports/services/DriverService';
import { Driver } from '@domain/entities/Driver';

@Injectable()
export class NestDriverService implements DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
  ) {}

  private toDriver(entity: DriverEntity): Driver {
    return new Driver(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.phoneNumber,
      entity.licenseNumber,
      entity.licenseType,
      entity.licenseExpiryDate,
      entity.experienceYears,
      entity.drivingHistory,
    );
  }

  async createDriver(dto: CreateDriverDTO): Promise<string> {
    const newDriver = this.driverRepository.create({
      id: uuidv4(),
      ...dto,
      licenseType: 'standard', // valeur par défaut
      experienceYears: 0, // valeur par défaut
      drivingHistory: '', // valeur par défaut
    });
    const savedDriver = await this.driverRepository.save(newDriver);
    return savedDriver.id;
  }

  async updateDriver(dto: UpdateDriverDTO): Promise<void> {
    const { id, ...updateData } = dto;
    await this.driverRepository.update(id, updateData);
  }

  async deleteDriver(id: string): Promise<void> {
    await this.driverRepository.delete(id);
  }

  async getAllDrivers(): Promise<Driver[]> {
    const entities = await this.driverRepository.find();
    return entities.map((entity) => this.toDriver(entity));
  }

  async getDriverById(id: string): Promise<Driver | null> {
    const entity = await this.driverRepository.findOne({ where: { id } });
    return entity ? this.toDriver(entity) : null;
  }

  async getDriverByEmail(email: string): Promise<Driver | null> {
    const entity = await this.driverRepository.findOne({ where: { email } });
    return entity ? this.toDriver(entity) : null;
  }

  async getDriversByLicenseExpiry(beforeDate: Date): Promise<Driver[]> {
    const entities = await this.driverRepository.find({
      where: {
        licenseExpiryDate: beforeDate,
      },
    });
    return entities.map((entity) => this.toDriver(entity));
  }
}