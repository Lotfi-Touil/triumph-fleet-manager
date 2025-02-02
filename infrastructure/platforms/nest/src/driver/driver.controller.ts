import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverEntity } from '../entities/driver.entity';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  findAll(): Promise<DriverEntity[]> {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DriverEntity> {
    return this.driverService.findOne(id);
  }

  @Post()
  create(@Body() driver: Omit<DriverEntity, 'id'>): Promise<DriverEntity> {
    return this.driverService.create(driver);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() driver: Partial<DriverEntity>,
  ): Promise<DriverEntity> {
    return this.driverService.update(id, driver);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.driverService.delete(id);
  }
} 