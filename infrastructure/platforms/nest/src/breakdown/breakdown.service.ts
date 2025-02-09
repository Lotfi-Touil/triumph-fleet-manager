import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { BreakdownService, CreateBreakdownDTO, UpdateBreakdownDTO } from '@application/ports/services/BreakdownService';
import { Breakdown } from '@domain/entities/Breakdown';
import { BikeRepository } from '../../../../../application/ports/repositories/BikeRepository';
import { BreakdownRepository } from '../../../../../application/ports/repositories/BreakdownRepository';
import { CreateBreakdown } from '@application/usecases/CreateBreakdown';
import { UpdateBreakdown } from '@application/usecases/UpdateBreakdown';
import { GetBreakdowns } from '@application/usecases/GetBreakdowns';
import { DeleteBreakdown } from '@application/usecases/DeleteBreakdown';
import { BIKE_REPOSITORY, BREAKDOWN_REPOSITORY } from './breakdown.constants';
import { SparePartsService } from '../spare-parts/spare-parts.service';
import { BreakdownSparePartEntity } from '../entities/breakdown-spare-part.entity';

@Injectable()
export class NestBreakdownService implements BreakdownService {
  constructor(
    private readonly createBreakdownUseCase: CreateBreakdown,
    private readonly updateBreakdownUseCase: UpdateBreakdown,
    private readonly getBreakdownsUseCase: GetBreakdowns,
    private readonly deleteBreakdownUseCase: DeleteBreakdown,
    @Inject(BIKE_REPOSITORY)
    private readonly bikeRepository: BikeRepository,
    @Inject(BREAKDOWN_REPOSITORY)
    private readonly breakdownRepository: BreakdownRepository,
    private readonly sparePartsService: SparePartsService,
    @InjectRepository(BreakdownSparePartEntity)
    private readonly breakdownSparePartRepository: Repository<BreakdownSparePartEntity>,
  ) {}

  async createBreakdown(dto: CreateBreakdownDTO): Promise<string> {
    const bike = await this.bikeRepository.findById(dto.bikeId);
    if (!bike) {
      throw new Error('Bike not found');
    }

    const breakdownId = randomUUID();

    await this.createBreakdownUseCase.execute({
      id: breakdownId,
      bikeId: dto.bikeId,
      description: dto.description,
      type: dto.type,
      warrantyApplied: dto.warrantyApplied,
    });

    if (dto.spareParts && dto.spareParts.length > 0) {
      for (const part of dto.spareParts) {
        const sparePart = await this.sparePartsService.getSparePartById(part.sparePartId);

        await this.breakdownSparePartRepository.save({
          id: randomUUID(),
          breakdownId,
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

    return breakdownId;
  }

  async updateBreakdown(dto: UpdateBreakdownDTO): Promise<void> {
    const breakdown = await this.breakdownRepository.findById(dto.id);
    if (!breakdown) {
      throw new Error('Breakdown not found');
    }

    if (dto.spareParts && dto.spareParts.length > 0) {
      await this.breakdownSparePartRepository.delete({ breakdownId: dto.id });

      for (const part of dto.spareParts) {
        const sparePart = await this.sparePartsService.getSparePartById(part.sparePartId);

        await this.breakdownSparePartRepository.save({
          id: randomUUID(),
          breakdownId: dto.id,
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

    await this.updateBreakdownUseCase.execute(dto);
  }

  async deleteBreakdown(id: string): Promise<void> {
    await this.breakdownSparePartRepository.delete({ breakdownId: id });
    await this.deleteBreakdownUseCase.execute(id);
  }

  async getAllBreakdowns(): Promise<Breakdown[]> {
    return this.getBreakdownsUseCase.execute();
  }

  async getBreakdownsByBikeId(bikeId: string): Promise<Breakdown[]> {
    const bike = await this.bikeRepository.findById(bikeId);
    if (!bike) {
      throw new Error('Bike not found');
    }
    return this.breakdownRepository.findByBikeId(bikeId);
  }

  async getUnresolvedBreakdowns(): Promise<Breakdown[]> {
    return this.breakdownRepository.findUnresolved();
  }

  async getWarrantyCoveredBreakdowns(): Promise<Breakdown[]> {
    return this.breakdownRepository.findWarrantyCovered();
  }

  async getBreakdownSpareParts(id: string): Promise<{
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
  }> {
    const breakdown = await this.breakdownRepository.findById(id);
    if (!breakdown) {
      throw new Error('Breakdown not found');
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
        details: sparePartsDetails.find((detail) => detail.id === sp.sparePartId)!,
      })),
      totalCost: total,
    };
  }
} 