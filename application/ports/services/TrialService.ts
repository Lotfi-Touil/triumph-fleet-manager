import { Trial } from '../../../domain/entities/Trial';
import { Driver } from '../../../domain/entities/Driver';
import { Bike } from '../../../domain/entities/Bike';

export interface CreateTrialDTO {
  driverId: string;
  bikeId: string;
  notes?: string;
}

export interface UpdateTrialDTO {
  endDate: Date;
  notes?: string;
}

export interface DriverDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiryDate: Date;
  experienceYears: number;
  drivingHistory: string;
}

export interface BikeDTO {
  id: string;
  name: string;
  registrationNumber: string;
  maintenanceKilometers: number;
  maintenanceMonths: number;
}

export interface TrialResponseDTO {
  id: string;
  driverId: string;
  bikeId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  driver: DriverDTO;
  bike: BikeDTO;
}

export interface TrialService {
  findAll(): Promise<TrialResponseDTO[]>;
  findByDriver(driverId: string): Promise<TrialResponseDTO[]>;
  findByBike(bikeId: string): Promise<TrialResponseDTO[]>;
  create(trial: CreateTrialDTO): Promise<TrialResponseDTO>;
  endTrial(id: string, trial: UpdateTrialDTO): Promise<TrialResponseDTO>;
  remove(id: string): Promise<void>;
} 