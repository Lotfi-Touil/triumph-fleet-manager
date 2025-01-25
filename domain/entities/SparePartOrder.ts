import { randomUUID } from "crypto";
import { SparePart } from "./SparePart";

export enum OrderStatus {
  PENDING = "PENDING",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class SparePartOrder {
  constructor(
    public readonly id: string,
    public sparePart: SparePart,
    public quantity: number,
    public unitPrice: number,
    public status: OrderStatus,
    public orderDate: Date,
    public expectedDeliveryDate: Date | null,
    public actualDeliveryDate: Date | null,
    public supplier: string,
    public orderReference?: string,
    public notes?: string
  ) {}

  static create(
    props: Pick<
      SparePartOrder,
      | "sparePart"
      | "quantity"
      | "unitPrice"
      | "status"
      | "orderDate"
      | "expectedDeliveryDate"
      | "actualDeliveryDate"
      | "supplier"
      | "orderReference"
      | "notes"
    > & { id?: string }
  ): SparePartOrder {
    return new SparePartOrder(
      props.id || randomUUID(),
      props.sparePart,
      props.quantity,
      props.unitPrice,
      props.status,
      props.orderDate,
      props.expectedDeliveryDate,
      props.actualDeliveryDate,
      props.supplier,
      props.orderReference,
      props.notes
    );
  }

  get totalCost(): number {
    return this.quantity * this.unitPrice;
  }

  get isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  get isLate(): boolean {
    if (
      !this.expectedDeliveryDate ||
      this.status === OrderStatus.DELIVERED ||
      this.status === OrderStatus.CANCELLED
    ) {
      return false;
    }
    return new Date() > this.expectedDeliveryDate;
  }
}
