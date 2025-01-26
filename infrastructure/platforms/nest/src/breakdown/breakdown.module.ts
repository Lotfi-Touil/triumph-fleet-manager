import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BikeEntity } from '../entities/bike.entity';
import { BreakdownEntity } from '../entities/breakdown.entity';
import { BreakdownController } from './breakdown.controller';
import { PostgresBikeRepository } from '@infrastructure/adapters/repositories/PostgresBikeRepository';
import { PostgresBreakdownRepository } from '@infrastructure/adapters/repositories/PostgresBreakdownRepository';
import { CreateBreakdown } from '@application/usecases/CreateBreakdown';
import { UpdateBreakdown } from '@application/usecases/UpdateBreakdown';
import { DeleteBreakdown } from '@application/usecases/DeleteBreakdown';
import { GetBreakdowns } from '@application/usecases/GetBreakdowns';
import { BIKE_REPOSITORY, BREAKDOWN_REPOSITORY } from './breakdown.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BikeEntity,
      BreakdownEntity,
    ]),
  ],
  controllers: [BreakdownController],
  providers: [
    {
      provide: BIKE_REPOSITORY,
      useFactory: (repository) => new PostgresBikeRepository(repository),
      inject: [getRepositoryToken(BikeEntity)],
    },
    {
      provide: BREAKDOWN_REPOSITORY,
      useFactory: (repository, bikeRepo) => new PostgresBreakdownRepository(repository, bikeRepo),
      inject: [getRepositoryToken(BreakdownEntity), getRepositoryToken(BikeEntity)],
    },
    {
      provide: CreateBreakdown,
      useFactory: (breakdownRepo, bikeRepo) => new CreateBreakdown(breakdownRepo, bikeRepo),
      inject: [BREAKDOWN_REPOSITORY, BIKE_REPOSITORY],
    },
    {
      provide: UpdateBreakdown,
      useFactory: (breakdownRepo) => new UpdateBreakdown(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
    {
      provide: DeleteBreakdown,
      useFactory: (breakdownRepo) => new DeleteBreakdown(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
    {
      provide: GetBreakdowns,
      useFactory: (breakdownRepo) => new GetBreakdowns(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
  ],
  exports: [
    BIKE_REPOSITORY,
    BREAKDOWN_REPOSITORY,
  ],
})
export class BreakdownModule {} 