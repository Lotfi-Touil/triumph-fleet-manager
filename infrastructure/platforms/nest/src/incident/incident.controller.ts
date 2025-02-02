import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentEntity } from '../entities/incident.entity';

@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  findAll(): Promise<IncidentEntity[]> {
    return this.incidentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IncidentEntity> {
    return this.incidentService.findOne(id);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string): Promise<IncidentEntity[]> {
    return this.incidentService.findByDriver(driverId);
  }

  @Post()
  create(@Body() incident: Omit<IncidentEntity, 'id'>): Promise<IncidentEntity> {
    return this.incidentService.create(incident);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() incident: Partial<IncidentEntity>,
  ): Promise<IncidentEntity> {
    return this.incidentService.update(id, incident);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.incidentService.delete(id);
  }
} 