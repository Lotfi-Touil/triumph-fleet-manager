import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NestBikeService } from './bike.service';
import { Bike } from '@domain/entities/Bike';
import { CreateBikeDTO } from './dto/create-bike.dto';
import { UpdateBikeDTO } from '@application/ports/services/BikeService';

@Controller('bikes')
export class BikeController {
  constructor(
    private readonly bikeService: NestBikeService,
  ) {}

  @Get('list')
  async getAllBikes(): Promise<Bike[]> {
    return this.bikeService.getAllBikes();
  }

  @Get(':id')
  async getBikeById(@Param('id') id: string): Promise<Bike> {
    const bike = await this.bikeService.getBikeById(id);
    if (!bike) {
      throw new Error('Bike not found');
    }
    return bike;
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBike(@Body() request: CreateBikeDTO): Promise<void> {
    console.log('Received create bike request:', request);
    return this.bikeService.createBike(request);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateBike(
    @Param('id') id: string,
    @Body() request: CreateBikeDTO,
  ): Promise<void> {
    return this.bikeService.updateBike({
      id,
      ...request,
    });
  }

  @Delete('delete/:id')
  async deleteBike(@Param('id') id: string): Promise<void> {
    return this.bikeService.deleteBike(id);
  }
} 