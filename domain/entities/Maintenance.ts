import { Bike } from "./Bike";
import { MaintenanceCalculator } from "../services/MaintenanceCalculator";
import { User } from "./User";

export class Maintenance {
  constructor(
    private readonly id: string,
    private readonly bike: Bike,
    private readonly lastMaintenanceDate: Date,
    private readonly lastMaintenanceKilometers: number,
    private readonly currentKilometers: number,
    private readonly technician: User | null
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

  public getTechnician(): User | null {
    return this.technician;
  }

  public isMaintenanceNeeded(): boolean {
    return MaintenanceCalculator.isMaintenanceNeeded(this);
  }

  public isMaintenanceUpcoming(): boolean {
    return MaintenanceCalculator.isMaintenanceUpcoming(this);
  }

  public getNextMaintenanceKilometers(): number {
    return MaintenanceCalculator.getNextMaintenanceKilometers(this);
  }

  public getNextMaintenanceDate(): Date {
    return MaintenanceCalculator.getNextMaintenanceDate(this);
  }
}
