import { Bike } from "../../../domain/entities/Bike";

export interface BikeRepository {
  findById(id: string): Promise<Bike | null>;
  findAll(): Promise<Bike[]>;
  save(bike: Bike): Promise<void>;
  delete(id: string): Promise<void>;
} 