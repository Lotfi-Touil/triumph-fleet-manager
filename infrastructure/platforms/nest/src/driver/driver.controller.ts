import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import { CreateDriverDTO, UpdateDriverDTO, DriverService, DRIVER_SERVICE } from '@application/ports/services/DriverService';
import { Driver } from '@domain/entities/Driver';

@Controller('drivers')
export class DriverController {
  constructor(
    @Inject(DRIVER_SERVICE)
    private readonly driverService: DriverService
  ) {}

  @Get()
  findAll(): Promise<Driver[]> {
    return this.driverService.getAllDrivers();
  }

  @Get('expiring')
  findByLicenseExpiry(@Query('beforeDate') beforeDate: string): Promise<Driver[]> {
    return this.driverService.getDriversByLicenseExpiry(new Date(beforeDate));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Driver | null> {
    return this.driverService.getDriverById(id);
  }

  @Post()
  async create(@Body() driver: CreateDriverDTO): Promise<{ id: string }> {
    const id = await this.driverService.createDriver(driver);
    return { id };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() driver: Omit<UpdateDriverDTO, 'id'>,
  ): Promise<void> {
    await this.driverService.updateDriver({ id, ...driver });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.driverService.deleteDriver(id);
  }
} 