import { Bike } from "./Bike";

export enum BreakdownStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

export enum BreakdownType {
  MECHANICAL = 'MECHANICAL',
  ELECTRICAL = 'ELECTRICAL',
  ELECTRONIC = 'ELECTRONIC',
  BODYWORK = 'BODYWORK',
  OTHER = 'OTHER'
}

export class Breakdown {
  constructor(
    private readonly id: string,
    private readonly bike: Bike,
    private description: string,
    private type: BreakdownType,
    private status: BreakdownStatus,
    private readonly reportDate: Date,
    private resolutionDate: Date | null,
    private warrantyApplied: boolean,
    private repairActions: string,
    private technicalRecommendations: string,
    private cost: number,
    private replacedParts: string[]
  ) {}

  getId(): string {
    return this.id;
  }

  getBike(): Bike {
    return this.bike;
  }

  getDescription(): string {
    return this.description;
  }

  getType(): BreakdownType {
    return this.type;
  }

  getStatus(): BreakdownStatus {
    return this.status;
  }

  getReportDate(): Date {
    return this.reportDate;
  }

  getResolutionDate(): Date | null {
    return this.resolutionDate;
  }

  isWarrantyApplied(): boolean {
    return this.warrantyApplied;
  }

  getRepairActions(): string {
    return this.repairActions;
  }

  getTechnicalRecommendations(): string {
    return this.technicalRecommendations;
  }

  getCost(): number {
    return this.cost;
  }

  getReplacedParts(): string[] {
    return [...this.replacedParts];
  }

  updateStatus(status: BreakdownStatus): void {
    this.status = status;
    if (status === BreakdownStatus.RESOLVED && !this.resolutionDate) {
      this.resolutionDate = new Date();
    }
  }

  updateRepairInfo(
    repairActions: string,
    technicalRecommendations: string,
    replacedParts: string[],
    cost: number
  ): void {
    this.repairActions = repairActions;
    this.technicalRecommendations = technicalRecommendations;
    this.replacedParts = [...replacedParts];
    this.cost = cost;
  }

  applyWarranty(applied: boolean): void {
    this.warrantyApplied = applied;
    if (applied) {
      this.cost = 0;
    }
  }

  isResolved(): boolean {
    return this.status === BreakdownStatus.RESOLVED;
  }
} 