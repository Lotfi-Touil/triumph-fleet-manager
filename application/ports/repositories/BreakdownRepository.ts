import { Breakdown } from "../../../domain/entities/Breakdown";

export interface BreakdownRepository {
  save(breakdown: Breakdown): Promise<void>;
  findById(id: string): Promise<Breakdown | null>;
  findByBikeId(bikeId: string): Promise<Breakdown[]>;
  findAll(): Promise<Breakdown[]>;
  update(breakdown: Breakdown): Promise<void>;
  delete(id: string): Promise<void>;
  findUnresolved(): Promise<Breakdown[]>;
  findWarrantyCovered(): Promise<Breakdown[]>;
} 