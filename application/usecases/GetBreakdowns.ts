import { Breakdown } from "../../domain/entities/Breakdown";
import { BreakdownRepository } from "../../domain/repositories/BreakdownRepository";

export class GetBreakdowns {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(): Promise<Breakdown[]> {
    return this.breakdownRepository.findAll();
  }

  async executeByBikeId(bikeId: string): Promise<Breakdown[]> {
    return this.breakdownRepository.findByBikeId(bikeId);
  }

  async executeUnresolved(): Promise<Breakdown[]> {
    return this.breakdownRepository.findUnresolved();
  }

  async executeWarrantyCovered(): Promise<Breakdown[]> {
    return this.breakdownRepository.findWarrantyCovered();
  }
} 