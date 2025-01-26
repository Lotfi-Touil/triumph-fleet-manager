import { Maintenance } from "./Maintenance";

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  ACKNOWLEDGED = "ACKNOWLEDGED",
}

export class MaintenanceNotification {
  constructor(
    private readonly id: string,
    private readonly maintenance: Maintenance,
    private readonly createdAt: Date,
    private status: NotificationStatus,
    private readonly message: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getMaintenance(): Maintenance {
    return this.maintenance;
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
    if (this.status === NotificationStatus.ACKNOWLEDGED) {
      throw new Error("Notification already acknowledged");
    }
    this.status = NotificationStatus.ACKNOWLEDGED;
  }

  public isPending(): boolean {
    return this.status === NotificationStatus.PENDING;
  }
}
