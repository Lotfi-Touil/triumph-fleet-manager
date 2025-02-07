import { Bike } from "./Bike";
import { MaintenanceCalculator } from "../services/MaintenanceCalculator";
import { User } from "./User";

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  REGULAR = 'REGULAR',
  INSPECTION = 'INSPECTION'
}

export class Maintenance {
  constructor(
    private readonly id: string,
    private readonly bike: Bike,
    private readonly maintenanceDate: Date,
    private readonly lastMaintenanceKilometers: number,
    private readonly currentKilometers: number,
    private technician: User | null,
    private status: MaintenanceStatus,
    private type: MaintenanceType,
    private replacedParts: string[] = [],
    private cost: number = 0,
    private technicalRecommendations: string = '',
    private workDescription: string = '',
    private nextRecommendedMaintenanceDate: Date | null = null
  ) {}

  public getId(): string {
    return this.id;
  }

  public getBike(): Bike {
    return this.bike;
  }

  public getMaintenanceDate(): Date {
    return this.maintenanceDate;
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

  public getStatus(): MaintenanceStatus {
    return this.status;
  }

  public getType(): MaintenanceType {
    return this.type;
  }

  public getReplacedParts(): string[] {
    return [...this.replacedParts];
  }

  public getCost(): number {
    return this.cost;
  }

  public getTechnicalRecommendations(): string {
    return this.technicalRecommendations;
  }

  public getWorkDescription(): string {
    return this.workDescription;
  }

  public getNextRecommendedMaintenanceDate(): Date | null {
    return this.nextRecommendedMaintenanceDate;
  }

  public updateStatus(status: MaintenanceStatus): void {
    this.status = status;
  }

  public assignTechnician(technician: User): void {
    this.technician = technician;
  }

  public updateMaintenanceDetails(
    replacedParts: string[],
    cost: number,
    technicalRecommendations: string,
    workDescription: string,
    nextRecommendedMaintenanceDate: Date | null
  ): void {
    this.replacedParts = [...replacedParts];
    this.cost = cost;
    this.technicalRecommendations = technicalRecommendations;
    this.workDescription = workDescription;
    this.nextRecommendedMaintenanceDate = nextRecommendedMaintenanceDate;
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
