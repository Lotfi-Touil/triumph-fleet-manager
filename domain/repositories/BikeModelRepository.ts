import { BikeModel } from "../entities/BikeModel";

export interface BikeModelRepository {
  save(bikeModel: BikeModel): Promise<void>;
  findById(id: string): Promise<BikeModel | null>;
  findAll(): Promise<BikeModel[]>;
  delete(id: string): Promise<void>;
}
