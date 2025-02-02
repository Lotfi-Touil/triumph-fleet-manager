export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  TRAFFIC_VIOLATION = 'TRAFFIC_VIOLATION',
  COMPLAINT = 'COMPLAINT',
  OTHER = 'OTHER'
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class Incident {
  constructor(
    private readonly id: string,
    private readonly driverId: string,
    private readonly type: string,
    private readonly description: string,
    private readonly date: Date,
    private readonly location: string,
    private readonly severity: string,
    private readonly status: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getDriverId(): string {
    return this.driverId;
  }

  public getType(): string {
    return this.type;
  }

  public getDescription(): string {
    return this.description;
  }

  public getDate(): Date {
    return this.date;
  }

  public getLocation(): string {
    return this.location;
  }

  public getSeverity(): string {
    return this.severity;
  }

  public getStatus(): string {
    return this.status;
  }
}