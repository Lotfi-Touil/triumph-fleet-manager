import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BikeEntity } from '../entities/bike.entity';
import { BikeController } from './bike.controller';
import { NestBikeService } from './bike.service';
import { PostgresBikeRepository } from '@infrastructure/adapters/repositories/PostgresBikeRepository';
import { CreateBike } from '@application/usecases/CreateBike';
import { UpdateBike } from '@application/usecases/UpdateBike';
import { DeleteBike } from '@application/usecases/DeleteBike';
import { BIKE_REPOSITORY, MAINTENANCE_REPOSITORY } from '../maintenance/maintenance.constants';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BikeEntity]),
    MaintenanceModule,
  ],
  controllers: [BikeController],
  providers: [
    NestBikeService,
    {
      provide: BIKE_REPOSITORY,
      useFactory: (repository) => new PostgresBikeRepository(repository),
      inject: [getRepositoryToken(BikeEntity)],
    },
    {
      provide: CreateBike,
      useFactory: (bikeRepo) => new CreateBike(bikeRepo),
      inject: [BIKE_REPOSITORY],
    },
    {
      provide: UpdateBike,
      useFactory: (bikeRepo) => new UpdateBike(bikeRepo),
      inject: [BIKE_REPOSITORY],
    },
    {
      provide: DeleteBike,
      useFactory: (bikeRepo, maintenanceRepo) => new DeleteBike(bikeRepo, maintenanceRepo),
      inject: [BIKE_REPOSITORY, MAINTENANCE_REPOSITORY],
    },
  ],
  exports: [BIKE_REPOSITORY, NestBikeService],
})
export class BikeModule {} 