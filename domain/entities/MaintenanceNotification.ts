import { Maintenance } from "./Maintenance";

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  ACKNOWLEDGED = "ACKNOWLEDGED",
}

export enum NotificationType {
  MAINTENANCE = "MAINTENANCE",
  LOW_STOCK = "LOW_STOCK",
}

export class MaintenanceNotification {
  constructor(
    private readonly id: string,
    private readonly maintenance: Maintenance,
    private readonly createdAt: Date,
    private status: NotificationStatus,
    private readonly message: string,
    private readonly type: NotificationType = NotificationType.MAINTENANCE
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

  public getType(): NotificationType {
    return this.type;
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
