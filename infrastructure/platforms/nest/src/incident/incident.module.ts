import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentController } from './incident.controller';
import { NestIncidentService } from './incident.service';
import { IncidentEntity } from '../entities/incident.entity';
import { INCIDENT_SERVICE } from './incident.constants';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentEntity])],
  controllers: [IncidentController],
  providers: [
    NestIncidentService,
    {
      provide: INCIDENT_SERVICE,
      useClass: NestIncidentService
    }
  ],
  exports: [INCIDENT_SERVICE, NestIncidentService]
})
export class IncidentModule {} 