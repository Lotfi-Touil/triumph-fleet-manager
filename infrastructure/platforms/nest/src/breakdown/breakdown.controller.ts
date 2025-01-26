import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateBreakdown } from '@application/usecases/CreateBreakdown';
import { UpdateBreakdown } from '@application/usecases/UpdateBreakdown';
import { GetBreakdowns } from '@application/usecases/GetBreakdowns';
import { DeleteBreakdown } from '@application/usecases/DeleteBreakdown';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import { BreakdownRepository } from '@domain/repositories/BreakdownRepository';
import { BIKE_REPOSITORY, BREAKDOWN_REPOSITORY } from './breakdown.constants';
import { randomUUID } from 'crypto';
import { BreakdownType, BreakdownStatus } from '@domain/entities/Breakdown';

@Controller('breakdown')
export class BreakdownController {
  constructor(
    private readonly createBreakdown: CreateBreakdown,
    private readonly updateBreakdown: UpdateBreakdown,
    private readonly getBreakdowns: GetBreakdowns,
    private readonly deleteBreakdown: DeleteBreakdown,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
    @Inject(BREAKDOWN_REPOSITORY)
    private readonly breakdownRepository: BreakdownRepository,
  ) {}

  @Post('create-breakdown')
  async create(@Body() data: {
    bikeId: string;
    description: string;
    type: BreakdownType;
    warrantyApplied: boolean;
  }) {
    const bike = await this.bikeRepository.findById(data.bikeId);
    if (!bike) {
      throw new Error('Bike not found');
    }

    return this.createBreakdown.execute({
      id: randomUUID(),
      bikeId: data.bikeId,
      description: data.description,
      type: data.type,
      warrantyApplied: data.warrantyApplied,
    });
  }

  @Put('update-breakdown/:id')
  async update(
    @Param('id') id: string,
    @Body() data: {
      status?: BreakdownStatus;
      repairActions?: string;
      technicalRecommendations?: string;
      replacedParts?: string[];
      cost?: number;
      warrantyApplied?: boolean;
    },
  ) {
    const breakdown = await this.breakdownRepository.findById(id);
    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    return this.updateBreakdown.execute({
      id,
      ...data,
    });
  }

  @Delete('delete-breakdown/:id')
  async delete(@Param('id') id: string) {
    return this.deleteBreakdown.execute(id);
  }

  @Get('breakdowns')
  async getAll() {
    return this.getBreakdowns.execute();
  }

  @Get('breakdowns/bike/:bikeId')
  async getByBike(@Param('bikeId') bikeId: string) {
    const bike = await this.bikeRepository.findById(bikeId);
    if (!bike) {
      throw new Error('Bike not found');
    }
    return this.breakdownRepository.findByBikeId(bikeId);
  }

  @Get('breakdowns/unresolved')
  async getUnresolved() {
    return this.breakdownRepository.findUnresolved();
  }

  @Get('breakdowns/warranty')
  async getWarrantyCovered() {
    return this.breakdownRepository.findWarrantyCovered();
  }
} 