import { MaintenanceSchedule } from "./MaintenanceSchedule";

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  ACKNOWLEDGED = "ACKNOWLEDGED",
}

export class MaintenanceNotification {
  constructor(
    private readonly id: string,
    private readonly maintenanceSchedule: MaintenanceSchedule,
    private readonly createdAt: Date,
    private status: NotificationStatus,
    private readonly message: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getMaintenanceSchedule(): MaintenanceSchedule {
    return this.maintenanceSchedule;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getStatus(): NotificationStatus {
    return this.status;
  }

  public getMessage(): string {
    return this.message;
  }

  public acknowledge(): void {
    this.status = NotificationStatus.ACKNOWLEDGED;
  }

  public markAsSent(): void {
    this.status = NotificationStatus.SENT;
  }
}
