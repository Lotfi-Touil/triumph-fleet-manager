import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { BreakdownType, BreakdownStatus } from '@domain/entities/Breakdown';
import { BreakdownService, CreateBreakdownDTO, UpdateBreakdownDTO } from '@application/ports/services/BreakdownService';

interface BreakdownResponse {
  id: string;
  bike: {
    id: string;
    name: string;
    registrationNumber: string;
  };
  description: string;
  type: BreakdownType;
  status: BreakdownStatus;
  reportDate: string;
  resolutionDate: string | null;
  warrantyApplied: boolean;
  repairActions: string | null;
  technicalRecommendations: string | null;
  spareParts: Array<{
    id: string;
    sparePartId: string;
    quantity: number;
    unitPrice: number;
    details: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      category: string;
    };
  }>;
  totalCost: number;
}

@Controller('breakdowns')
export class BreakdownController {
  constructor(
    @Inject('BreakdownService')
    private readonly breakdownService: BreakdownService,
  ) {}

  @Post('create')
  async create(@Body() data: CreateBreakdownDTO) {
    try {
      const id = await this.breakdownService.createBreakdown(data);
      return { id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Omit<UpdateBreakdownDTO, 'id'>,
  ) {
    try {
      await this.breakdownService.updateBreakdown({ id, ...data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.breakdownService.deleteBreakdown(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAll(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.breakdownService.getAllBreakdowns();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownService.getBreakdownSpareParts(breakdown.getId());
        const bike = breakdown.getBike();

        return {
          id: breakdown.getId(),
          bike: {
            id: bike.getId(),
            name: bike.getName(),
            registrationNumber: bike.getRegistrationNumber(),
          },
          description: breakdown.getDescription(),
          type: breakdown.getType(),
          status: breakdown.getStatus(),
          reportDate: breakdown.getReportDate().toISOString(),
          resolutionDate: breakdown.getResolutionDate()?.toISOString() || null,
          warrantyApplied: breakdown.isWarrantyApplied(),
          repairActions: breakdown.getRepairActions(),
          technicalRecommendations: breakdown.getTechnicalRecommendations(),
          spareParts: spareParts.spareParts,
          totalCost: spareParts.totalCost,
        };
      }),
    );
  }

  @Get('bike/:bikeId')
  async getByBike(@Param('bikeId') bikeId: string): Promise<BreakdownResponse[]> {
    try {
      const breakdowns = await this.breakdownService.getBreakdownsByBikeId(bikeId);
      return Promise.all(
        breakdowns.map(async (breakdown) => {
          const spareParts = await this.breakdownService.getBreakdownSpareParts(breakdown.getId());
          const bike = breakdown.getBike();

          return {
            id: breakdown.getId(),
            bike: {
              id: bike.getId(),
              name: bike.getName(),
              registrationNumber: bike.getRegistrationNumber(),
            },
            description: breakdown.getDescription(),
            type: breakdown.getType(),
            status: breakdown.getStatus(),
            reportDate: breakdown.getReportDate().toISOString(),
            resolutionDate: breakdown.getResolutionDate()?.toISOString() || null,
            warrantyApplied: breakdown.isWarrantyApplied(),
            repairActions: breakdown.getRepairActions(),
            technicalRecommendations: breakdown.getTechnicalRecommendations(),
            spareParts: spareParts.spareParts,
            totalCost: spareParts.totalCost,
          };
        }),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('unresolved')
  async getUnresolved(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.breakdownService.getUnresolvedBreakdowns();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownService.getBreakdownSpareParts(breakdown.getId());
        const bike = breakdown.getBike();

        return {
          id: breakdown.getId(),
          bike: {
            id: bike.getId(),
            name: bike.getName(),
            registrationNumber: bike.getRegistrationNumber(),
          },
          description: breakdown.getDescription(),
          type: breakdown.getType(),
          status: breakdown.getStatus(),
          reportDate: breakdown.getReportDate().toISOString(),
          resolutionDate: breakdown.getResolutionDate()?.toISOString() || null,
          warrantyApplied: breakdown.isWarrantyApplied(),
          repairActions: breakdown.getRepairActions(),
          technicalRecommendations: breakdown.getTechnicalRecommendations(),
          spareParts: spareParts.spareParts,
          totalCost: spareParts.totalCost,
        };
      }),
    );
  }

  @Get('warranty')
  async getWarrantyCovered(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.breakdownService.getWarrantyCoveredBreakdowns();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownService.getBreakdownSpareParts(breakdown.getId());
        const bike = breakdown.getBike();

        return {
          id: breakdown.getId(),
          bike: {
            id: bike.getId(),
            name: bike.getName(),
            registrationNumber: bike.getRegistrationNumber(),
          },
          description: breakdown.getDescription(),
          type: breakdown.getType(),
          status: breakdown.getStatus(),
          reportDate: breakdown.getReportDate().toISOString(),
          resolutionDate: breakdown.getResolutionDate()?.toISOString() || null,
          warrantyApplied: breakdown.isWarrantyApplied(),
          repairActions: breakdown.getRepairActions(),
          technicalRecommendations: breakdown.getTechnicalRecommendations(),
          spareParts: spareParts.spareParts,
          totalCost: spareParts.totalCost,
        };
      }),
    );
  }

  @Get(':id/spare-parts')
  async getBreakdownSpareParts(@Param('id') id: string) {
    try {
      return await this.breakdownService.getBreakdownSpareParts(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
