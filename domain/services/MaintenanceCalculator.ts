import { Maintenance } from "../entities/Maintenance";
import { Kilometers } from "../value-objects/Kilometers";

export class MaintenanceCalculator {
  private static readonly UPCOMING_DAYS_THRESHOLD = 15;
  private static readonly UPCOMING_KILOMETERS_THRESHOLD = 500;

  public static isMaintenanceNeeded(maintenance: Maintenance): boolean {
    return (
      this.isMaintenanceNeededByKilometers(maintenance) ||
      this.isMaintenanceNeededByDate(maintenance)
    );
  }

  public static isMaintenanceUpcoming(maintenance: Maintenance): boolean {
    return (
      this.isMaintenanceUpcomingByKilometers(maintenance) ||
      this.isMaintenanceUpcomingByDate(maintenance)
    );
  }

  private static isMaintenanceNeededByKilometers(
    maintenance: Maintenance
  ): boolean {
    const currentKilometers = maintenance.getCurrentKilometers();
    const lastMaintenanceKilometers = maintenance.getLastMaintenanceKilometers();
    const maintenanceInterval = maintenance
      .getBike()
      .getMaintenanceInterval()
      .getKilometers();

    return (
      currentKilometers - lastMaintenanceKilometers >= maintenanceInterval
    );
  }

  private static isMaintenanceNeededByDate(maintenance: Maintenance): boolean {
    const monthsSinceLastMaintenance =
      MaintenanceCalculator.getMonthsDifference(
        maintenance.getMaintenanceDate(),
        new Date()
      );
    return monthsSinceLastMaintenance >= maintenance.getBike().getMaintenanceInterval().getMonthInterval();
  }

  private static isMaintenanceUpcomingByKilometers(
    maintenance: Maintenance
  ): boolean {
    const currentKilometers = maintenance.getCurrentKilometers();
    const lastMaintenanceKilometers = maintenance.getLastMaintenanceKilometers();
    const maintenanceInterval = maintenance
      .getBike()
      .getMaintenanceInterval()
      .getKilometers();
    const upcomingThreshold = maintenanceInterval * 0.9;

    return (
      currentKilometers - lastMaintenanceKilometers >= upcomingThreshold &&
      currentKilometers - lastMaintenanceKilometers < maintenanceInterval
    );
  }

  private static isMaintenanceUpcomingByDate(maintenance: Maintenance): boolean {
    const monthsSinceLastMaintenance =
      MaintenanceCalculator.getMonthsDifference(
        maintenance.getMaintenanceDate(),
        new Date()
      );
    const maintenanceInterval = maintenance
      .getBike()
      .getMaintenanceInterval()
      .getMonthInterval();
    const upcomingThreshold = maintenanceInterval * 0.9;

    return (
      monthsSinceLastMaintenance >= upcomingThreshold &&
      monthsSinceLastMaintenance < maintenanceInterval
    );
  }

  public static getNextMaintenanceKilometers(maintenance: Maintenance): number {
    return (
      maintenance.getLastMaintenanceKilometers() +
      maintenance.getBike().getMaintenanceInterval().getKilometers()
    );
  }

  public static getNextMaintenanceDate(maintenance: Maintenance): Date {
    const nextDate = new Date(maintenance.getMaintenanceDate());
    nextDate.setMonth(
      nextDate.getMonth() +
        maintenance.getBike().getMaintenanceInterval().getMonthInterval()
    );
    return nextDate;
  }

  private static getMonthsDifference(date1: Date, date2: Date): number {
    const yearDiff = date2.getFullYear() - date1.getFullYear();
    const monthDiff = date2.getMonth() - date1.getMonth();
    return yearDiff * 12 + monthDiff;
  }
}
