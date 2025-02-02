import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TrialService } from './trial.service';
import { CreateTrialDto } from './dto/create-trial.dto';
import { UpdateTrialDto } from './dto/update-trial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@domain/entities/User';

@Controller('trials')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.FLEET_MANAGER)
@UsePipes(new ValidationPipe({ transform: true }))
export class TrialController {
  constructor(private readonly trialService: TrialService) {}

  @Get()
  findAll() {
    return this.trialService.findAll();
  }

  @Get('driver/:id')
  findByDriver(@Param('id') id: string) {
    return this.trialService.findByDriver(id);
  }

  @Get('bike/:id')
  findByBike(@Param('id') id: string) {
    return this.trialService.findByBike(id);
  }

  @Post()
  create(@Body() createTrialDto: CreateTrialDto) {
    return this.trialService.create(createTrialDto);
  }

  @Put(':id/end')
  endTrial(@Param('id') id: string, @Body() updateTrialDto: UpdateTrialDto) {
    return this.trialService.endTrial(id, updateTrialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trialService.remove(id);
  }
} 