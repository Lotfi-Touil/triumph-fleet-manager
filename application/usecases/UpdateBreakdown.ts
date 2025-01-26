import { BreakdownRepository } from "../../domain/repositories/BreakdownRepository";
import { BreakdownStatus } from "../../domain/entities/Breakdown";

export interface UpdateBreakdownRequest {
  id: string;
  status?: BreakdownStatus;
  repairActions?: string;
  technicalRecommendations?: string;
  replacedParts?: string[];
  cost?: number;
  warrantyApplied?: boolean;
}

export class UpdateBreakdown {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(request: UpdateBreakdownRequest): Promise<void> {
    const breakdown = await this.breakdownRepository.findById(request.id);
    if (!breakdown) {
      throw new Error("Breakdown not found");
    }

    if (request.status) {
      breakdown.updateStatus(request.status);
    }

    if (request.warrantyApplied !== undefined) {
      breakdown.applyWarranty(request.warrantyApplied);
    }

    if (
      request.repairActions !== undefined ||
      request.technicalRecommendations !== undefined ||
      request.replacedParts !== undefined ||
      request.cost !== undefined
    ) {
      breakdown.updateRepairInfo(
        request.repairActions ?? breakdown.getRepairActions(),
        request.technicalRecommendations ?? breakdown.getTechnicalRecommendations(),
        request.replacedParts ?? breakdown.getReplacedParts(),
        request.cost ?? breakdown.getCost()
      );
    }

    await this.breakdownRepository.save(breakdown);
  }
} 