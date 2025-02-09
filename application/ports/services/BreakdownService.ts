import { Breakdown, BreakdownType, BreakdownStatus } from '@domain/entities/Breakdown';

export interface SparePartRequest {
  sparePartId: string;
  quantity: number;
}

export interface CreateBreakdownDTO {
  bikeId: string;
  description: string;
  type: BreakdownType;
  warrantyApplied: boolean;
  spareParts?: SparePartRequest[];
}

export interface UpdateBreakdownDTO {
  id: string;
  status?: BreakdownStatus;
  repairActions?: string;
  technicalRecommendations?: string;
  spareParts?: SparePartRequest[];
  cost?: number;
  warrantyApplied?: boolean;
}

export interface BreakdownService {
  createBreakdown(dto: CreateBreakdownDTO): Promise<string>;
  updateBreakdown(dto: UpdateBreakdownDTO): Promise<void>;
  deleteBreakdown(id: string): Promise<void>;
  getAllBreakdowns(): Promise<Breakdown[]>;
  getBreakdownsByBikeId(bikeId: string): Promise<Breakdown[]>;
  getUnresolvedBreakdowns(): Promise<Breakdown[]>;
  getWarrantyCoveredBreakdowns(): Promise<Breakdown[]>;
  getBreakdownSpareParts(id: string): Promise<{
    spareParts: Array<{
      id: string;
      sparePartId: string;
      quantity: number;
      unitPrice: number;
      details: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        category: string;
      };
    }>;
    totalCost: number;
  }>;
} 