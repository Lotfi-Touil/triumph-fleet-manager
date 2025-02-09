import { Bike } from "../../../domain/entities/Bike";
import { MaintenanceInterval } from "../../../domain/value-objects/MaintenanceInterval";

export interface CreateBikeDTO {
  name: string;
  registrationNumber: string;
  maintenanceInterval: {
    kilometers: number;
    monthInterval: number;
  };
}

export interface UpdateBikeDTO extends CreateBikeDTO {
  id: string;
}

export interface BikeService {
  createBike(dto: CreateBikeDTO): Promise<void>;
  updateBike(dto: UpdateBikeDTO): Promise<void>;
  deleteBike(id: string): Promise<void>;
  getBikeById(id: string): Promise<Bike | null>;
  getAllBikes(): Promise<Bike[]>;
}