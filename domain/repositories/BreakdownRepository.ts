import { Breakdown } from "../entities/Breakdown";

export interface BreakdownRepository {
  save(breakdown: Breakdown): Promise<void>;
  findById(id: string): Promise<Breakdown | null>;
  findByBikeId(bikeId: string): Promise<Breakdown[]>;
  findAll(): Promise<Breakdown[]>;
  findUnresolved(): Promise<Breakdown[]>;
  findByStatus(status: string): Promise<Breakdown[]>;
  findWarrantyCovered(): Promise<Breakdown[]>;
  delete(id: string): Promise<void>;
} 