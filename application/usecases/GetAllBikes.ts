import { Bike } from "@domain/entities/Bike";
import { BikeRepository } from "@domain/repositories/BikeRepository";

export class GetAllBikes {
  constructor(private readonly bikeRepository: BikeRepository) {}

  async execute(): Promise<Bike[]> {
    return this.bikeRepository.findAll();
  }
} 