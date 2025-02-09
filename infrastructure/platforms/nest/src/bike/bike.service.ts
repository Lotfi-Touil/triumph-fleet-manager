import { Injectable, Inject } from '@nestjs/common';
import { BikeService, CreateBikeDTO, UpdateBikeDTO } from '@application/ports/services/BikeService';
import { Bike } from '@domain/entities/Bike';
import { CreateBike } from '@application/usecases/CreateBike';
import { UpdateBike } from '@application/usecases/UpdateBike';
import { DeleteBike } from '@application/usecases/DeleteBike';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import { BIKE_REPOSITORY } from '../maintenance/maintenance.constants';

@Injectable()
export class NestBikeService implements BikeService {
  constructor(
    @Inject(CreateBike)
    private readonly createBikeUseCase: CreateBike,
    @Inject(UpdateBike)
    private readonly updateBikeUseCase: UpdateBike,
    @Inject(DeleteBike)
    private readonly deleteBikeUseCase: DeleteBike,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
  ) {}

  async createBike(dto: CreateBikeDTO): Promise<void> {
    await this.createBikeUseCase.execute(dto);
  }

  async updateBike(dto: UpdateBikeDTO): Promise<void> {
    await this.updateBikeUseCase.execute(dto);
  }

  async deleteBike(id: string): Promise<void> {
    await this.deleteBikeUseCase.execute(id);
  }

  async getBikeById(id: string): Promise<Bike | null> {
    return this.bikeRepository.findById(id);
  }

  async getAllBikes(): Promise<Bike[]> {
    return this.bikeRepository.findAll();
  }
}