import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { CreateIncidentDTO, IncidentDTO, UpdateIncidentDTO, IncidentService } from '../../../../../application/ports/services/IncidentService';
import { INCIDENT_SERVICE } from './incident.constants';

@Controller('incidents')
export class IncidentController {
  constructor(
    @Inject(INCIDENT_SERVICE)
    private readonly incidentService: IncidentService
  ) {}

  @Get()
  async findAll(): Promise<IncidentDTO[]> {
    return this.incidentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IncidentDTO> {
    return this.incidentService.findOne(id);
  }

  @Get('driver/:driverId')
  async findByDriver(@Param('driverId') driverId: string): Promise<IncidentDTO[]> {
    return this.incidentService.findByDriver(driverId);
  }

  @Post()
  async create(@Body() incident: CreateIncidentDTO): Promise<IncidentDTO> {
    return this.incidentService.create(incident);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() incident: UpdateIncidentDTO,
  ): Promise<IncidentDTO> {
    return this.incidentService.update(id, incident);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.incidentService.delete(id);
  }
} 