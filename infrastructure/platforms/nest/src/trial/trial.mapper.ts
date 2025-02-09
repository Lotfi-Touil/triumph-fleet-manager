import { Trial as DomainTrial } from '@domain/entities/Trial';
import { Trial as NestTrial } from './trial.entity';
import { Driver } from '@domain/entities/Driver';
import { Bike } from '@domain/entities/Bike';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';

export class TrialMapper {
  static toDomain(nestTrial: NestTrial): DomainTrial {
    const driver = new Driver(
      nestTrial.driver.id,
      nestTrial.driver.firstName,
      nestTrial.driver.lastName,
      nestTrial.driver.email,
      nestTrial.driver.phoneNumber,
      nestTrial.driver.licenseNumber,
      nestTrial.driver.licenseType,
      nestTrial.driver.licenseExpiryDate,
      nestTrial.driver.experienceYears,
      nestTrial.driver.drivingHistory
    );

    const maintenanceInterval = new MaintenanceInterval(
      nestTrial.bike.maintenanceKilometers,
      nestTrial.bike.maintenanceMonths
    );

    const bike = new Bike(
      nestTrial.bike.id,
      nestTrial.bike.name,
      nestTrial.bike.registrationNumber,
      maintenanceInterval
    );

    const trial = new DomainTrial({
      id: nestTrial.id,
      driverId: nestTrial.driver.id,
      bikeId: nestTrial.bike.id,
      startDate: nestTrial.startDate,
      endDate: nestTrial.endDate,
      notes: nestTrial.notes,
      createdAt: nestTrial.createdAt,
      updatedAt: nestTrial.updatedAt
    });

    return trial;
  }

  static toDomainList(nestTrials: NestTrial[]): DomainTrial[] {
    return nestTrials.map(this.toDomain);
  }
} 