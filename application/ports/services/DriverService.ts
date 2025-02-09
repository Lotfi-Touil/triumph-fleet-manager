import { Driver } from '@domain/entities/Driver';

export const DRIVER_SERVICE = 'DRIVER_SERVICE';

export interface CreateDriverDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
}

export interface UpdateDriverDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  licenseExpiryDate?: Date;
}

export interface DriverService {
  createDriver(dto: CreateDriverDTO): Promise<string>;
  updateDriver(dto: UpdateDriverDTO): Promise<void>;
  deleteDriver(id: string): Promise<void>;
  getAllDrivers(): Promise<Driver[]>;
  getDriverById(id: string): Promise<Driver | null>;
  getDriverByEmail(email: string): Promise<Driver | null>;
  getDriversByLicenseExpiry(beforeDate: Date): Promise<Driver[]>;
} 