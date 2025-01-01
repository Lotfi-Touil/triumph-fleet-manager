import { BikeModel } from "./BikeModel";

export class MaintenanceSchedule {
  constructor(
    private readonly id: string,
    private readonly bikeModel: BikeModel,
    private readonly lastMaintenanceDate: Date,
    private readonly lastMaintenanceKilometers: number,
    private readonly currentKilometers: number
  ) {}

  public getId(): string {
    return this.id;
  }

  public getBikeModel(): BikeModel {
    return this.bikeModel;
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
    const maintenanceInterval = this.bikeModel.getMaintenanceInterval();

    // Vérifier si l'intervalle kilométrique est dépassé
    const kilometersDifference =
      this.currentKilometers - this.lastMaintenanceKilometers;
    if (kilometersDifference >= maintenanceInterval.getKilometers()) {
      return true;
    }

    // Vérifier si l'intervalle temporel est dépassé
    const monthsSinceLastMaintenance = this.getMonthsDifference(
      this.lastMaintenanceDate,
      new Date()
    );
    return monthsSinceLastMaintenance >= maintenanceInterval.getMonthInterval();
  }

  private getMonthsDifference(date1: Date, date2: Date): number {
    const yearDifference = date2.getFullYear() - date1.getFullYear();
    const monthDifference = date2.getMonth() - date1.getMonth();
    return yearDifference * 12 + monthDifference;
  }

  public getNextMaintenanceKilometers(): number {
    return (
      this.lastMaintenanceKilometers +
      this.bikeModel.getMaintenanceInterval().getKilometers()
    );
  }

  public getNextMaintenanceDate(): Date {
    const nextDate = new Date(this.lastMaintenanceDate);
    nextDate.setMonth(
      nextDate.getMonth() +
        this.bikeModel.getMaintenanceInterval().getMonthInterval()
    );
    return nextDate;
  }
}
