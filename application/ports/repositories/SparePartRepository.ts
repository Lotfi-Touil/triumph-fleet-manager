import { SparePart } from "../../../domain/entities/SparePart";

export interface SparePartRepository {
  findById(id: string): Promise<SparePart | null>;
  findAll(): Promise<SparePart[]>;
  findByCategory(category: string): Promise<SparePart[]>;
  save(sparePart: SparePart): Promise<void>;
  update(sparePart: SparePart): Promise<void>;
  delete(id: string): Promise<void>;
  findLowStock(): Promise<SparePart[]>; // Find items that need restocking
}
