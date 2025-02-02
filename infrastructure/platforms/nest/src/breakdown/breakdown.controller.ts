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
import { CreateBreakdown } from '@application/usecases/CreateBreakdown';
import { UpdateBreakdown } from '@application/usecases/UpdateBreakdown';
import { GetBreakdowns } from '@application/usecases/GetBreakdowns';
import { DeleteBreakdown } from '@application/usecases/DeleteBreakdown';
import { BikeRepository } from '@domain/repositories/BikeRepository';
import { BreakdownRepository } from '@domain/repositories/BreakdownRepository';
import { BIKE_REPOSITORY, BREAKDOWN_REPOSITORY } from './breakdown.constants';
import { randomUUID } from 'crypto';
import { BreakdownType, BreakdownStatus } from '@domain/entities/Breakdown';
import { SparePartsService } from '../spare-parts/spare-parts.service';
import { Repository } from 'typeorm';
import { BreakdownSparePartEntity } from '../entities/breakdown-spare-part.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface SparePartRequest {
  sparePartId: string;
  quantity: number;
}

interface SparePartDetails {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

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
    details: SparePartDetails;
  }>;
  totalCost: number;
}

interface BreakdownSparePartsResponse {
  spareParts: Array<{
    id: string;
    sparePartId: string;
    quantity: number;
    unitPrice: number;
    details: SparePartDetails;
  }>;
  totalCost: number;
}

@Controller('breakdowns')
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
    private readonly sparePartsService: SparePartsService,
    @InjectRepository(BreakdownSparePartEntity)
    private readonly breakdownSparePartRepository: Repository<BreakdownSparePartEntity>,
  ) {}

  @Post('create')
  async create(
    @Body()
    data: {
      bikeId: string;
      description: string;
      type: BreakdownType;
      warrantyApplied: boolean;
      spareParts?: SparePartRequest[];
    },
  ) {
    const bike = await this.bikeRepository.findById(data.bikeId);
    if (!bike) {
      throw new BadRequestException('Bike not found');
    }

    const breakdownId = randomUUID();

    // Create the breakdown
    await this.createBreakdown.execute({
      id: breakdownId,
      bikeId: data.bikeId,
      description: data.description,
      type: data.type,
      warrantyApplied: data.warrantyApplied,
    });

    // Handle spare parts if provided
    if (data.spareParts && data.spareParts.length > 0) {
      for (const part of data.spareParts) {
        // Get spare part details and verify stock
        const sparePart = await this.sparePartsService.getSparePartById(
          part.sparePartId,
        );

        // Create breakdown spare part association
        await this.breakdownSparePartRepository.save({
          id: randomUUID(),
          breakdownId,
          sparePartId: part.sparePartId,
          quantity: part.quantity,
          unitPrice: sparePart.price,
        });

        // Update spare part quantity
        await this.sparePartsService.updateSparePartQuantity(
          part.sparePartId,
          part.quantity,
        );
      }
    }

    return { id: breakdownId };
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body()
    data: {
      status?: BreakdownStatus;
      repairActions?: string;
      technicalRecommendations?: string;
      spareParts?: SparePartRequest[];
      cost?: number;
      warrantyApplied?: boolean;
    },
  ) {
    const breakdown = await this.breakdownRepository.findById(id);
    if (!breakdown) {
      throw new BadRequestException('Breakdown not found');
    }

    // Handle spare parts if provided
    if (data.spareParts && data.spareParts.length > 0) {
      // Remove existing spare parts
      await this.breakdownSparePartRepository.delete({ breakdownId: id });

      // Add new spare parts
      for (const part of data.spareParts) {
        const sparePart = await this.sparePartsService.getSparePartById(
          part.sparePartId,
        );

        await this.breakdownSparePartRepository.save({
          id: randomUUID(),
          breakdownId: id,
          sparePartId: part.sparePartId,
          quantity: part.quantity,
          unitPrice: sparePart.price,
        });

        await this.sparePartsService.updateSparePartQuantity(
          part.sparePartId,
          part.quantity,
        );
      }
    }

    return this.updateBreakdown.execute({
      id,
      ...data,
    });
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    // Delete associated spare parts first
    await this.breakdownSparePartRepository.delete({ breakdownId: id });
    return this.deleteBreakdown.execute(id);
  }

  @Get()
  async getAll(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.getBreakdowns.execute();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownSparePartRepository.find({
          where: { breakdownId: breakdown.getId() },
        });

        const sparePartsDetails =
          await this.sparePartsService.getSparePartsByIds(
            spareParts.map((sp) => sp.sparePartId),
          );

        const total = spareParts.reduce(
          (sum, sp) => sum + sp.quantity * sp.unitPrice,
          0,
        );

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
          spareParts: spareParts.map((sp) => ({
            ...sp,
            details: sparePartsDetails.find(
              (detail) => detail.id === sp.sparePartId,
            )!,
          })),
          totalCost: total,
        };
      }),
    );
  }

  @Get('bike/:bikeId')
  async getByBike(
    @Param('bikeId') bikeId: string,
  ): Promise<BreakdownResponse[]> {
    const bike = await this.bikeRepository.findById(bikeId);
    if (!bike) {
      throw new BadRequestException('Bike not found');
    }
    const breakdowns = await this.breakdownRepository.findByBikeId(bikeId);

    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownSparePartRepository.find({
          where: { breakdownId: breakdown.getId() },
        });

        const sparePartsDetails =
          await this.sparePartsService.getSparePartsByIds(
            spareParts.map((sp) => sp.sparePartId),
          );

        const total = spareParts.reduce(
          (sum, sp) => sum + sp.quantity * sp.unitPrice,
          0,
        );

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
          spareParts: spareParts.map((sp) => ({
            ...sp,
            details: sparePartsDetails.find(
              (detail) => detail.id === sp.sparePartId,
            )!,
          })),
          totalCost: total,
        };
      }),
    );
  }

  @Get('unresolved')
  async getUnresolved(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.breakdownRepository.findUnresolved();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownSparePartRepository.find({
          where: { breakdownId: breakdown.getId() },
        });

        const sparePartsDetails =
          await this.sparePartsService.getSparePartsByIds(
            spareParts.map((sp) => sp.sparePartId),
          );

        const total = spareParts.reduce(
          (sum, sp) => sum + sp.quantity * sp.unitPrice,
          0,
        );

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
          spareParts: spareParts.map((sp) => ({
            ...sp,
            details: sparePartsDetails.find(
              (detail) => detail.id === sp.sparePartId,
            )!,
          })),
          totalCost: total,
        };
      }),
    );
  }

  @Get('warranty')
  async getWarrantyCovered(): Promise<BreakdownResponse[]> {
    const breakdowns = await this.breakdownRepository.findWarrantyCovered();
    return Promise.all(
      breakdowns.map(async (breakdown) => {
        const spareParts = await this.breakdownSparePartRepository.find({
          where: { breakdownId: breakdown.getId() },
        });

        const sparePartsDetails =
          await this.sparePartsService.getSparePartsByIds(
            spareParts.map((sp) => sp.sparePartId),
          );

        const total = spareParts.reduce(
          (sum, sp) => sum + sp.quantity * sp.unitPrice,
          0,
        );

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
          spareParts: spareParts.map((sp) => ({
            ...sp,
            details: sparePartsDetails.find(
              (detail) => detail.id === sp.sparePartId,
            )!,
          })),
          totalCost: total,
        };
      }),
    );
  }

  @Get(':id/spare-parts')
  async getBreakdownSpareParts(
    @Param('id') id: string,
  ): Promise<BreakdownSparePartsResponse> {
    const breakdown = await this.breakdownRepository.findById(id);
    if (!breakdown) {
      throw new BadRequestException('Breakdown not found');
    }

    const spareParts = await this.breakdownSparePartRepository.find({
      where: { breakdownId: id },
    });

    const sparePartsDetails = await this.sparePartsService.getSparePartsByIds(
      spareParts.map((sp) => sp.sparePartId),
    );

    const total = spareParts.reduce(
      (sum, sp) => sum + sp.quantity * sp.unitPrice,
      0,
    );

    return {
      spareParts: spareParts.map((sp) => ({
        ...sp,
        details: sparePartsDetails.find(
          (detail) => detail.id === sp.sparePartId,
        )!,
      })),
      totalCost: total,
    };
  }
}
