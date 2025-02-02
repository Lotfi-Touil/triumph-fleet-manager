export class BreakdownSparePart {
  constructor(
    private readonly props: {
      id: string;
      breakdownId: string;
      sparePartId: string;
      quantity: number;
      unitPrice: number;
    }
  ) {}

  get id(): string {
    return this.props.id;
  }

  get breakdownId(): string {
    return this.props.breakdownId;
  }

  get sparePartId(): string {
    return this.props.sparePartId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get totalPrice(): number {
    return this.quantity * this.unitPrice;
  }

  static create(props: {
    id: string;
    breakdownId: string;
    sparePartId: string;
    quantity: number;
    unitPrice: number;
  }): BreakdownSparePart {
    return new BreakdownSparePart(props);
  }

  toJSON() {
    return {
      id: this.id,
      breakdownId: this.breakdownId,
      sparePartId: this.sparePartId,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
    };
  }
}
