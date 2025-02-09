import { Breakdown, BreakdownStatus, BreakdownType } from "../../domain/entities/Breakdown";
import { BreakdownRepository } from "../ports/repositories/BreakdownRepository";
import { BikeRepository } from "../ports/repositories/BikeRepository";

export interface CreateBreakdownRequest {
  id: string;
  bikeId: string;
  description: string;
  type: BreakdownType;
  warrantyApplied: boolean;
}

export class CreateBreakdown {
  constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly bikeRepository: BikeRepository
  ) {}

  async execute(request: CreateBreakdownRequest): Promise<void> {
    const bike = await this.bikeRepository.findById(request.bikeId);
    if (!bike) {
      throw new Error("Bike not found");
    }

    const breakdown = new Breakdown(
      request.id,
      bike,
      request.description,
      request.type,
      BreakdownStatus.REPORTED,
      new Date(),
      null,
      request.warrantyApplied,
      "",
      "",
      0,
      []
    );

    await this.breakdownRepository.save(breakdown);
  }
} 