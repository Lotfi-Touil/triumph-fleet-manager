export enum OrderStatus {
  PENDING = "PENDING",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface SparePart {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  location: string;
  price: number;
}

export interface SparePartOrder {
  id: string;
  sparePart: SparePart;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  orderDate: Date;
  expectedDeliveryDate: Date | null;
  actualDeliveryDate: Date | null;
  supplier: string;
  orderReference?: string;
  notes?: string;
  isLate?: boolean;
}
