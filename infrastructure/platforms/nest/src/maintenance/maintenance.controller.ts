import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateBikeModel } from '@application/usecases/CreateBikeModel';
import { CreateMaintenanceSchedule } from '@application/usecases/CreateMaintenanceSchedule';
import { GetDueMaintenances } from '@application/usecases/GetDueMaintenances';
import { MaintenanceSchedule } from '@domain/entities/MaintenanceSchedule';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject(CreateBikeModel)
    private readonly createBikeModelUseCase: CreateBikeModel,
    @Inject(CreateMaintenanceSchedule)
    private readonly createMaintenanceScheduleUseCase: CreateMaintenanceSchedule,
    @Inject(GetDueMaintenances)
    private readonly getDueMaintenancesUseCase: GetDueMaintenances,
  ) {}

  @Post('bike-models')
  async createBikeModel(
    @Body()
    request: {
      id: string;
      name: string;
      maintenanceKilometers: number;
      maintenanceMonths: number;
    },
  ): Promise<void> {
    await this.createBikeModelUseCase.execute(request);
  }

  @Post('schedules')
  async createSchedule(
    @Body()
    request: {
      id: string;
      bikeModelId: string;
      lastMaintenanceDate: string;
      lastMaintenanceKilometers: number;
      currentKilometers: number;
    },
  ): Promise<void> {
    await this.createMaintenanceScheduleUseCase.execute({
      ...request,
      lastMaintenanceDate: new Date(request.lastMaintenanceDate),
    });
  }

  @Get('due')
  async getDueMaintenances(): Promise<MaintenanceSchedule[]> {
    return this.getDueMaintenancesUseCase.execute();
  }
}
