import { Collection, MongoClient } from "mongodb";
import {
  SparePartOrder,
  OrderStatus,
} from "../../../domain/entities/SparePartOrder";
import { SparePartOrderRepository } from "../../../application/ports/repositories/SparePartOrderRepository";
import { SparePart } from "../../../domain/entities/SparePart";

export class MongoSparePartOrderRepository implements SparePartOrderRepository {
  private collection: Collection;

  constructor(private readonly client: MongoClient) {
    this.collection = this.client
      .db("fleet-manager")
      .collection("spare-part-orders");
  }

  private mapToEntity(doc: any): SparePartOrder {
    return SparePartOrder.create({
      id: doc.id,
      sparePart: SparePart.create(doc.sparePart),
      quantity: doc.quantity,
      unitPrice: doc.unitPrice,
      status: doc.status as OrderStatus,
      orderDate: new Date(doc.orderDate),
      expectedDeliveryDate: doc.expectedDeliveryDate
        ? new Date(doc.expectedDeliveryDate)
        : null,
      actualDeliveryDate: doc.actualDeliveryDate
        ? new Date(doc.actualDeliveryDate)
        : null,
      supplier: doc.supplier,
      orderReference: doc.orderReference,
      notes: doc.notes,
    });
  }

  private mapToDocument(order: SparePartOrder): any {
    return {
      id: order.id,
      sparePart: order.sparePart,
      quantity: order.quantity,
      unitPrice: order.unitPrice,
      status: order.status,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
      supplier: order.supplier,
      orderReference: order.orderReference,
      notes: order.notes,
    };
  }

  async findById(id: string): Promise<SparePartOrder | null> {
    const doc = await this.collection.findOne({ id });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<SparePartOrder[]> {
    const docs = await this.collection.find().toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findByStatus(status: OrderStatus): Promise<SparePartOrder[]> {
    const docs = await this.collection.find({ status }).toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findBySparePartId(sparePartId: string): Promise<SparePartOrder[]> {
    const docs = await this.collection
      .find({ "sparePart.id": sparePartId })
      .toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findPendingOrders(): Promise<SparePartOrder[]> {
    const docs = await this.collection
      .find({
        status: { $in: [OrderStatus.PENDING, OrderStatus.ORDERED] },
      })
      .toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findLateOrders(): Promise<SparePartOrder[]> {
    const now = new Date();
    const docs = await this.collection
      .find({
        status: OrderStatus.ORDERED,
        expectedDeliveryDate: { $lt: now },
      })
      .toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async save(order: SparePartOrder): Promise<void> {
    await this.collection.insertOne(this.mapToDocument(order));
  }

  async update(order: SparePartOrder): Promise<void> {
    await this.collection.updateOne(
      { id: order.id },
      { $set: this.mapToDocument(order) }
    );
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }
}
