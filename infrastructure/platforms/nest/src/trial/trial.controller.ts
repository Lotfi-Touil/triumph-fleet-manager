import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { TrialService } from '@application/ports/services/TrialService';
import { CreateTrialDTO, UpdateTrialDTO, TrialResponseDTO } from '@application/ports/services/TrialService';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@domain/entities/User';
import { TRIAL_SERVICE } from './trial.constants';

@Controller('trials')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)
@UsePipes(new ValidationPipe({ transform: true }))
export class TrialController {
  constructor(
    @Inject(TRIAL_SERVICE)
    private readonly trialService: TrialService
  ) {}

  @Get()
  async findAll(): Promise<TrialResponseDTO[]> {
    return this.trialService.findAll();
  }

  @Get('driver/:id')
  async findByDriver(@Param('id') id: string): Promise<TrialResponseDTO[]> {
    return this.trialService.findByDriver(id);
  }

  @Get('bike/:id')
  async findByBike(@Param('id') id: string): Promise<TrialResponseDTO[]> {
    return this.trialService.findByBike(id);
  }

  @Post()
  async create(@Body() createTrialDto: CreateTrialDTO): Promise<TrialResponseDTO> {
    return this.trialService.create(createTrialDto);
  }

  @Put(':id/end')
  async endTrial(@Param('id') id: string, @Body() updateTrialDto: UpdateTrialDTO): Promise<TrialResponseDTO> {
    return this.trialService.endTrial(id, updateTrialDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.trialService.remove(id);
  }
} 