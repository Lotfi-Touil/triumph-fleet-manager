import { Maintenance } from "../entities/Maintenance";
import { Kilometers } from "../value-objects/Kilometers";

export class MaintenanceCalculator {
  public static isMaintenanceNeeded(maintenance: Maintenance): boolean {
    const maintenanceInterval = maintenance.getBike().getMaintenanceInterval();
    const currentKilometers = new Kilometers(maintenance.getCurrentKilometers());
    const lastMaintenanceKilometers = new Kilometers(maintenance.getLastMaintenanceKilometers());
    const kilometersDifference = currentKilometers.subtract(lastMaintenanceKilometers);

    // Vérifier si l'intervalle kilométrique est dépassé
    if (kilometersDifference.isGreaterThanOrEqual(new Kilometers(maintenanceInterval.getKilometers()))) {
      return true;
    }

    // Vérifier si l'intervalle temporel est dépassé
    const monthsSinceLastMaintenance = MaintenanceCalculator.getMonthsDifference(
      maintenance.getLastMaintenanceDate(),
      new Date()
    );
    return monthsSinceLastMaintenance >= maintenanceInterval.getMonthInterval();
  }

  public static getNextMaintenanceKilometers(maintenance: Maintenance): number {
    const lastMaintenanceKilometers = new Kilometers(maintenance.getLastMaintenanceKilometers());
    const intervalKilometers = new Kilometers(maintenance.getBike().getMaintenanceInterval().getKilometers());
    return lastMaintenanceKilometers.add(intervalKilometers).getValue();
  }

  public static getNextMaintenanceDate(maintenance: Maintenance): Date {
    const nextDate = new Date(maintenance.getLastMaintenanceDate());
    nextDate.setMonth(
      nextDate.getMonth() + maintenance.getBike().getMaintenanceInterval().getMonthInterval()
    );
    return nextDate;
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    const yearDifference = date2.getFullYear() - date1.getFullYear();
    const monthDifference = date2.getMonth() - date1.getMonth();
    return yearDifference * 12 + monthDifference;
  }
} 