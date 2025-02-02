import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverEntity } from '../entities/driver.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
  ) {}

  async findAll(): Promise<DriverEntity[]> {
    return this.driverRepository.find();
  }

  async findOne(id: string): Promise<DriverEntity> {
    return this.driverRepository.findOne({ where: { id } });
  }

  async create(driver: Omit<DriverEntity, 'id'>): Promise<DriverEntity> {
    const newDriver = this.driverRepository.create({
      id: uuidv4(),
      ...driver,
    });
    return this.driverRepository.save(newDriver);
  }

  async update(id: string, driver: Partial<DriverEntity>): Promise<DriverEntity> {
    await this.driverRepository.update(id, driver);
    return this.driverRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.driverRepository.delete(id);
  }
}