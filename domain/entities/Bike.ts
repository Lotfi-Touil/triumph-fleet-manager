import { MaintenanceInterval } from "../value-objects/MaintenanceInterval";

export class Bike {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly maintenanceInterval: MaintenanceInterval
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getMaintenanceInterval(): MaintenanceInterval {
    return this.maintenanceInterval;
  }
} 