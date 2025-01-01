import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckAndCreateMaintenanceNotifications } from '@application/usecases/CheckAndCreateMaintenanceNotifications';

@Injectable()
export class MaintenanceCheckService {
  constructor(
    private readonly checkAndCreateNotifications: CheckAndCreateMaintenanceNotifications,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleMaintenanceCheck() {
    try {
      await this.checkAndCreateNotifications.execute();
    } catch (error) {
      console.error('Error checking maintenance notifications:', error);
    }
  }
}
