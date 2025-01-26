import { Bike } from "@domain/entities/Bike";
import { BikeRepository } from "@domain/repositories/BikeRepository";

export class GetBikeById {
  constructor(private readonly bikeRepository: BikeRepository) {}

  async execute(id: string): Promise<Bike | null> {
    return this.bikeRepository.findById(id);
  }
} 