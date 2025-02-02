import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BreakdownController } from './breakdown.controller';
import { BikeEntity } from '../entities/bike.entity';
import { BreakdownEntity } from '../entities/breakdown.entity';
import { BreakdownSparePartEntity } from '../entities/breakdown-spare-part.entity';
import { PostgresBikeRepository } from '@infrastructure/adapters/repositories/PostgresBikeRepository';
import { PostgresBreakdownRepository } from '@infrastructure/adapters/repositories/PostgresBreakdownRepository';
import { CreateBreakdown } from '@application/usecases/CreateBreakdown';
import { UpdateBreakdown } from '@application/usecases/UpdateBreakdown';
import { GetBreakdowns } from '@application/usecases/GetBreakdowns';
import { DeleteBreakdown } from '@application/usecases/DeleteBreakdown';
import { BIKE_REPOSITORY, BREAKDOWN_REPOSITORY } from './breakdown.constants';
import { SparePartsModule } from '../spare-parts/spare-parts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BikeEntity,
      BreakdownEntity,
      BreakdownSparePartEntity,
    ]),
    SparePartsModule,
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
      useFactory: (breakdownRepo, bikeRepo) =>
        new PostgresBreakdownRepository(breakdownRepo, bikeRepo),
      inject: [
        getRepositoryToken(BreakdownEntity),
        getRepositoryToken(BikeEntity),
      ],
    },
    {
      provide: CreateBreakdown,
      useFactory: (breakdownRepo, bikeRepo) =>
        new CreateBreakdown(breakdownRepo, bikeRepo),
      inject: [BREAKDOWN_REPOSITORY, BIKE_REPOSITORY],
    },
    {
      provide: UpdateBreakdown,
      useFactory: (breakdownRepo) => new UpdateBreakdown(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
    {
      provide: GetBreakdowns,
      useFactory: (breakdownRepo) => new GetBreakdowns(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
    {
      provide: DeleteBreakdown,
      useFactory: (breakdownRepo) => new DeleteBreakdown(breakdownRepo),
      inject: [BREAKDOWN_REPOSITORY],
    },
  ],
  exports: [BREAKDOWN_REPOSITORY],
})
export class BreakdownModule {}
