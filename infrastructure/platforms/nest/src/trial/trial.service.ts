import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect, FindOptionsOrder } from 'typeorm';
import { Trial } from './trial.entity';
import { TrialService, CreateTrialDTO, UpdateTrialDTO } from '@application/ports/services/TrialService';
import { MaintenanceService, CreateMaintenanceDTO, UpdateMaintenanceDTO } from '@application/ports/services/MaintenanceService';
import { DriverEntity } from '../entities/driver.entity';
import { BikeEntity } from '../entities/bike.entity';

const TRIAL_SELECT_OPTIONS: FindOptionsSelect<Trial> = {
  id: true,
  startDate: true,
  endDate: true,
  notes: true,
  driver: {
    id: true,
    firstName: true,
    lastName: true,
  },
  bike: {
    id: true,
    name: true,
    registrationNumber: true,
  },
};

const TRIAL_ORDER: FindOptionsOrder<Trial> = {
  startDate: 'DESC',
};

const DEFAULT_FIND_OPTIONS = {
  relations: ['driver', 'bike'],
  select: TRIAL_SELECT_OPTIONS,
  order: TRIAL_ORDER,
};

@Injectable()
export class NestTrialService implements TrialService {
  constructor(
    @InjectRepository(Trial)
    private trialRepository: Repository<Trial>,
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>,
  ) {}

  async findAll(): Promise<Trial[]> {
    return this.trialRepository.find(DEFAULT_FIND_OPTIONS);
  }

  async findByDriver(driverId: string): Promise<Trial[]> {
    return this.trialRepository.find({
      ...DEFAULT_FIND_OPTIONS,
      where: { driver: { id: driverId } },
    });
  }

  async findByBike(bikeId: string): Promise<Trial[]> {
    return this.trialRepository.find({
      ...DEFAULT_FIND_OPTIONS,
      where: { bike: { id: bikeId } },
    });
  }

  async create(createTrialDto: CreateTrialDTO): Promise<Trial> {
    const [driver, bike] = await Promise.all([
      this.driverRepository.findOne({ where: { id: createTrialDto.driverId } }),
      this.bikeRepository.findOne({ where: { id: createTrialDto.bikeId } }),
    ]);

    if (!driver) throw new NotFoundException('Driver not found');
    if (!bike) throw new NotFoundException('Bike not found');

    const trial = this.trialRepository.create({
      driver,
      bike,
      startDate: createTrialDto.startDate,
      notes: createTrialDto.notes,
    });

    return this.trialRepository.save(trial);
  }

  async endTrial(id: string, updateTrialDto: UpdateTrialDTO): Promise<Trial> {
    const trial = await this.trialRepository.findOne({ where: { id } });
    if (!trial) throw new NotFoundException('Trial not found');
    if (!trial.startDate) throw new BadRequestException('Trial has no start date');
    if (trial.endDate) throw new BadRequestException('Trial is already ended');

    const endDate = new Date(updateTrialDto.endDate);
    if (isNaN(endDate.getTime())) throw new BadRequestException('Invalid end date format');
    if (endDate < trial.startDate) throw new BadRequestException('End date cannot be before start date');

    try {
      Object.assign(trial, {
        endDate,
        notes: updateTrialDto.notes || trial.notes,
      });

      return await this.trialRepository.save(trial);
    } catch (error) {
      throw new BadRequestException(`Failed to update trial: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.trialRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Trial not found');
  }
} 