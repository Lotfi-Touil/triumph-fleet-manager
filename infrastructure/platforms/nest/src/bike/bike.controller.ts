import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateBike } from '@application/usecases/CreateBike';
import { UpdateBike } from '@application/usecases/UpdateBike';
import { DeleteBike } from '@application/usecases/DeleteBike';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import { BIKE_REPOSITORY } from '../maintenance/maintenance.constants';
import { Bike } from '@domain/entities/Bike';
import { MaintenanceInterval } from '@domain/value-objects/MaintenanceInterval';
import { randomUUID } from 'crypto';

@Controller('bikes')
export class BikeController {
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

  @Get('list')
  async getAllBikes(): Promise<Bike[]> {
    return this.bikeRepository.findAll();
  }

  @Get(':id')
  async getBikeById(@Param('id') id: string): Promise<Bike> {
    return this.bikeRepository.findById(id);
  }

  @Post('create')
  async createBike(
    @Body()
    request: {
      name: string;
      maintenanceKilometers: number;
      maintenanceMonths: number;
    },
  ): Promise<void> {
    const bike = new Bike(
      randomUUID(),
      request.name,
      new MaintenanceInterval(request.maintenanceKilometers, request.maintenanceMonths)
    );
    return this.bikeRepository.save(bike);
  }

  @Put('update/:id')
  async updateBike(
    @Param('id') id: string,
    @Body()
    request: {
      name: string;
      maintenanceKilometers: number;
      maintenanceMonths: number;
    },
  ): Promise<void> {
    const existingBike = await this.bikeRepository.findById(id);
    if (!existingBike) {
      throw new Error('Bike not found');
    }

    const bike = new Bike(
      id,
      request.name,
      new MaintenanceInterval(request.maintenanceKilometers, request.maintenanceMonths)
    );
    return this.bikeRepository.save(bike);
  }

  @Delete('delete/:id')
  async deleteBike(@Param('id') id: string): Promise<void> {
    await this.deleteBikeUseCase.execute(id);
  }
} 