import { Trial } from '@domain/entities/Trial';

export interface CreateTrialDTO {
  driverId: string;
  bikeId: string;
  startDate: Date;
  notes?: string;
}

export interface UpdateTrialDTO {
  endDate: Date;
  notes?: string;
}

export interface TrialService {
  findAll(): Promise<Trial[]>;
  findByDriver(driverId: string): Promise<Trial[]>;
  findByBike(bikeId: string): Promise<Trial[]>;
  create(createTrialDto: CreateTrialDTO): Promise<Trial>;
  endTrial(id: string, updateTrialDto: UpdateTrialDTO): Promise<Trial>;
  remove(id: string): Promise<void>;
} 