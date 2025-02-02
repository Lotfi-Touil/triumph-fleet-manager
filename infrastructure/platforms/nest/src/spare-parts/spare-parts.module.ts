import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SparePartsService } from './spare-parts.service';
import { BreakdownSparePartEntity } from '../entities/breakdown-spare-part.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    TypeOrmModule.forFeature([BreakdownSparePartEntity]),
  ],
  providers: [SparePartsService],
  exports: [SparePartsService],
})
export class SparePartsModule {}
