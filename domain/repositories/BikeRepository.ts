import { Bike } from "../entities/Bike";

export interface BikeRepository {
  save(bike: Bike): Promise<void>;
  findById(id: string): Promise<Bike | null>;
  findAll(): Promise<Bike[]>;
  delete(id: string): Promise<void>;
} 