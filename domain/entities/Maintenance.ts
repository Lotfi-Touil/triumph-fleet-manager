import { Bike } from "./Bike";
import { MaintenanceCalculator } from "../services/MaintenanceCalculator";

export class Maintenance {
  constructor(
    private readonly id: string,
    private readonly bike: Bike,
    private readonly lastMaintenanceDate: Date,
    private readonly lastMaintenanceKilometers: number,
    private readonly currentKilometers: number
  ) {}

  public getId(): string {
    return this.id;
  }

  public getBike(): Bike {
    return this.bike;
  }

  public getLastMaintenanceDate(): Date {
    return this.lastMaintenanceDate;
  }

  public getLastMaintenanceKilometers(): number {
    return this.lastMaintenanceKilometers;
  }

  public getCurrentKilometers(): number {
    return this.currentKilometers;
  }

  public isMaintenanceNeeded(): boolean {
    return MaintenanceCalculator.isMaintenanceNeeded(this);
  }

  public getNextMaintenanceKilometers(): number {
    return MaintenanceCalculator.getNextMaintenanceKilometers(this);
  }

  public getNextMaintenanceDate(): Date {
    return MaintenanceCalculator.getNextMaintenanceDate(this);
  }
} 