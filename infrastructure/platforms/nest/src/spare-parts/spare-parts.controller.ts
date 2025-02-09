import { Controller, Get, Put, Param } from '@nestjs/common';
import { SparePartsService } from './spare-parts.service';
import { SparePartNotification } from './spare-parts.service';

@Controller('api/spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Get('notifications/low-stock')
  async getLowStockNotifications(): Promise<SparePartNotification[]> {
    return this.sparePartsService.getLowStockNotifications();
  }

  @Put('notifications/:id/acknowledge')
  async acknowledgeNotification(@Param('id') id: string): Promise<void> {
    return this.sparePartsService.acknowledgeNotification(id);
  }
}