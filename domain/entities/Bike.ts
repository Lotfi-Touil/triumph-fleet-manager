import { MaintenanceInterval } from "../value-objects/MaintenanceInterval";

export class Bike {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly registrationNumber: string,
    private readonly maintenanceInterval: MaintenanceInterval
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getRegistrationNumber(): string {
    return this.registrationNumber;
  }

  public getMaintenanceInterval(): MaintenanceInterval {
    return this.maintenanceInterval;
  }
} 