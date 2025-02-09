import { Collection, MongoClient } from "mongodb";
import { SparePart } from "@domain/entities/SparePart";
import { SparePartRepository } from "@application/ports/repositories/SparePartRepository";

export class MongoSparePartRepository implements SparePartRepository {
  private collection: Collection;

  constructor(private readonly client: MongoClient) {
    this.collection = this.client.db("fleet-manager").collection("spare-parts");
  }

  async findById(id: string): Promise<SparePart | null> {
    const doc = await this.collection.findOne({ id });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<SparePart[]> {
    const docs = await this.collection.find().toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findByCategory(category: string): Promise<SparePart[]> {
    const docs = await this.collection.find({ category }).toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async save(sparePart: SparePart): Promise<void> {
    await this.collection.insertOne(this.mapToDocument(sparePart));
  }

  async update(sparePart: SparePart): Promise<void> {
    await this.collection.updateOne(
      { id: sparePart.id },
      { $set: this.mapToDocument(sparePart) }
    );
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ id });
  }

  async findLowStock(): Promise<SparePart[]> {
    const docs = await this.collection
      .find({
        $expr: { $lte: ["$quantity", "$minQuantity"] },
      })
      .toArray();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  private mapToEntity(doc: any): SparePart {
    return new SparePart(
      doc.id,
      doc.name,
      doc.category,
      doc.quantity,
      doc.minQuantity,
      doc.location,
      new Date(doc.lastRestockDate),
      doc.price,
      doc.supplier,
      doc.notes
    );
  }

  private mapToDocument(sparePart: SparePart): any {
    return {
      id: sparePart.id,
      name: sparePart.name,
      category: sparePart.category,
      quantity: sparePart.quantity,
      minQuantity: sparePart.minQuantity,
      location: sparePart.location,
      lastRestockDate: sparePart.lastRestockDate,
      price: sparePart.price,
      supplier: sparePart.supplier,
      notes: sparePart.notes,
    };
  }
}
