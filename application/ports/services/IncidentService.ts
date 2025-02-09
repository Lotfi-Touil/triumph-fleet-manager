import { Driver } from '../../../domain/entities/Driver';

export interface CreateIncidentDTO {
  description: string;
  date: Date;
  driverId: string;
  location: string;
  severity: string;
  status: string;
}

export interface UpdateIncidentDTO {
  description?: string;
  date?: Date;
  driverId?: string;
  location?: string;
  severity?: string;
  status?: string;
}

export interface IncidentDTO {
  id: string;
  description: string;
  date: Date;
  driverId: string;
  driver?: Driver;
  location: string;
  severity: string;
  status: string;
}

export interface IncidentService {
  findAll(): Promise<IncidentDTO[]>;
  findOne(id: string): Promise<IncidentDTO>;
  findByDriver(driverId: string): Promise<IncidentDTO[]>;
  create(incident: CreateIncidentDTO): Promise<IncidentDTO>;
  update(id: string, incident: UpdateIncidentDTO): Promise<IncidentDTO>;
  delete(id: string): Promise<void>;
} 