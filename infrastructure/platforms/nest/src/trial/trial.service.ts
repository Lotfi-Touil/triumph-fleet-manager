import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Trial as NestTrial } from './trial.entity';
import { TrialService, CreateTrialDTO, UpdateTrialDTO, TrialResponseDTO } from '@application/ports/services/TrialService';
import { DriverEntity } from '../entities/driver.entity';
import { BikeEntity } from '../entities/bike.entity';

const DEFAULT_FIND_OPTIONS = {
  relations: ['driver', 'bike'],
  order: {
    startDate: 'DESC',
  } as FindOptionsOrder<NestTrial>,
};

@Injectable()
export class NestTrialService implements TrialService {
  constructor(
    @InjectRepository(NestTrial)
    private trialRepository: Repository<NestTrial>,
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
    @InjectRepository(BikeEntity)
    private bikeRepository: Repository<BikeEntity>
  ) {}

  private toResponseDTO(trial: NestTrial): TrialResponseDTO {
    return {
      id: trial.id,
      driverId: trial.driver.id,
      bikeId: trial.bike.id,
      startDate: trial.startDate,
      endDate: trial.endDate,
      notes: trial.notes,
      createdAt: trial.createdAt,
      updatedAt: trial.updatedAt,
      driver: {
        id: trial.driver.id,
        firstName: trial.driver.firstName,
        lastName: trial.driver.lastName,
        email: trial.driver.email,
        phoneNumber: trial.driver.phoneNumber,
        licenseNumber: trial.driver.licenseNumber,
        licenseType: trial.driver.licenseType,
        licenseExpiryDate: trial.driver.licenseExpiryDate,
        experienceYears: trial.driver.experienceYears,
        drivingHistory: trial.driver.drivingHistory
      },
      bike: {
        id: trial.bike.id,
        name: trial.bike.name,
        registrationNumber: trial.bike.registrationNumber,
        maintenanceKilometers: trial.bike.maintenanceKilometers,
        maintenanceMonths: trial.bike.maintenanceMonths
      }
    };
  }

  async findAll(): Promise<TrialResponseDTO[]> {
    const trials = await this.trialRepository.find(DEFAULT_FIND_OPTIONS);
    return trials.map((trial) => this.toResponseDTO(trial));
  }

  async findByDriver(driverId: string): Promise<TrialResponseDTO[]> {
    const trials = await this.trialRepository.find({
      ...DEFAULT_FIND_OPTIONS,
      where: { driver: { id: driverId } }
    });
    return trials.map((trial) => this.toResponseDTO(trial));
  }

  async findByBike(bikeId: string): Promise<TrialResponseDTO[]> {
    const trials = await this.trialRepository.find({
      ...DEFAULT_FIND_OPTIONS,
      where: { bike: { id: bikeId } }
    });
    return trials.map((trial) => this.toResponseDTO(trial));
  }

  async create(createTrialDto: CreateTrialDTO): Promise<TrialResponseDTO> {
    const [driver, bike] = await Promise.all([
      this.driverRepository.findOne({ where: { id: createTrialDto.driverId } }),
      this.bikeRepository.findOne({ where: { id: createTrialDto.bikeId } })
    ]);

    if (!driver) throw new NotFoundException('Driver not found');
    if (!bike) throw new NotFoundException('Bike not found');

    const trial = this.trialRepository.create({
      driver,
      bike,
      startDate: new Date(),
      notes: createTrialDto.notes
    });

    const savedTrial = await this.trialRepository.save(trial);
    return this.toResponseDTO(savedTrial);
  }

  async endTrial(id: string, updateTrialDto: UpdateTrialDTO): Promise<TrialResponseDTO> {
    const trial = await this.trialRepository.findOne({
      where: { id },
      relations: ['driver', 'bike']
    });

    if (!trial) throw new NotFoundException('Trial not found');
    if (!trial.startDate) throw new BadRequestException('Trial has no start date');
    if (trial.endDate) throw new BadRequestException('Trial is already ended');

    const endDate = new Date(updateTrialDto.endDate);
    if (isNaN(endDate.getTime())) throw new BadRequestException('Invalid end date format');
    if (endDate < trial.startDate) throw new BadRequestException('End date cannot be before start date');

    try {
      Object.assign(trial, {
        endDate,
        notes: updateTrialDto.notes || trial.notes
      });

      const updatedTrial = await this.trialRepository.save(trial);
      return this.toResponseDTO(updatedTrial);
    } catch (error) {
      throw new BadRequestException(`Failed to update trial: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    const trial = await this.trialRepository.findOne({ where: { id } });
    if (!trial) throw new NotFoundException('Trial not found');
    await this.trialRepository.remove(trial);
  }
} 