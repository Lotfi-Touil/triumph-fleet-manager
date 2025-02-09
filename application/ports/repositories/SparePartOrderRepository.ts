import {
  SparePartOrder,
  OrderStatus,
} from "@domain/entities/SparePartOrder";

export interface SparePartOrderRepository {
  findById(id: string): Promise<SparePartOrder | null>;
  findAll(): Promise<SparePartOrder[]>;
  findByStatus(status: OrderStatus): Promise<SparePartOrder[]>;
  findBySparePartId(sparePartId: string): Promise<SparePartOrder[]>;
  findPendingOrders(): Promise<SparePartOrder[]>;
  findLateOrders(): Promise<SparePartOrder[]>;
  save(order: SparePartOrder): Promise<void>;
  update(order: SparePartOrder): Promise<void>;
  delete(id: string): Promise<void>;
}
