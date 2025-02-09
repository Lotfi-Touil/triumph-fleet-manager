import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from '../entities/driver.entity';
import { DriverController } from './driver.controller';
import { NestDriverService } from './driver.service';
import { DRIVER_SERVICE } from '@application/ports/services/DriverService';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  controllers: [DriverController],
  providers: [
    {
      provide: DRIVER_SERVICE,
      useClass: NestDriverService,
    },
  ],
  exports: [DRIVER_SERVICE],
})
export class DriverModule {} 