import { SparePart } from "../../domain/entities/SparePart";
import { SparePartRepository } from "../ports/repositories/SparePartRepository";

export class CheckLowStockAlert {
  constructor(private readonly sparePartRepository: SparePartRepository) {}

  async execute(): Promise<SparePart[]> {
    const allParts = await this.sparePartRepository.findAll();
    return allParts.filter((part) => part.quantity <= part.minQuantity);
  }
}
