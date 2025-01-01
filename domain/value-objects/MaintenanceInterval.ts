export class MaintenanceInterval {
  constructor(
    private readonly kilometers: number,
    private readonly monthInterval: number
  ) {
    this.validateKilometers(kilometers);
    this.validateMonthInterval(monthInterval);
  }

  private validateKilometers(kilometers: number): void {
    if (kilometers <= 0) {
      throw new Error("Kilometers interval must be greater than 0");
    }
  }

  private validateMonthInterval(months: number): void {
    if (months <= 0) {
      throw new Error("Month interval must be greater than 0");
    }
  }

  public getKilometers(): number {
    return this.kilometers;
  }

  public getMonthInterval(): number {
    return this.monthInterval;
  }
}
