export interface TrialProps {
  id?: string;
  driverId: string;
  bikeId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Trial {
  private props: TrialProps;

  constructor(props: TrialProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get driverId(): string {
    return this.props.driverId;
  }

  get bikeId(): string {
    return this.props.bikeId;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | undefined {
    return this.props.endDate;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  endTrial(endDate: Date, notes?: string): void {
    this.props.endDate = endDate;
    if (notes) {
      this.props.notes = notes;
    }
    this.props.updatedAt = new Date();
  }

  updateNotes(notes: string): void {
    this.props.notes = notes;
    this.props.updatedAt = new Date();
  }

  toJSON(): TrialProps {
    return {
      ...this.props,
    };
  }

  getId(): string | undefined {
    return this.id;
  }
} 