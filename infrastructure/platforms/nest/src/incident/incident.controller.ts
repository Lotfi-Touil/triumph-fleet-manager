import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDTO, IncidentDTO, UpdateIncidentDTO } from '../../../../../application/ports/services/IncidentService';

@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  findAll(): Promise<IncidentDTO[]> {
    return this.incidentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IncidentDTO> {
    return this.incidentService.findOne(id);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string): Promise<IncidentDTO[]> {
    return this.incidentService.findByDriver(driverId);
  }

  @Post()
  create(@Body() incident: CreateIncidentDTO): Promise<IncidentDTO> {
    return this.incidentService.create(incident);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() incident: UpdateIncidentDTO,
  ): Promise<IncidentDTO> {
    return this.incidentService.update(id, incident);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.incidentService.delete(id);
  }
} 