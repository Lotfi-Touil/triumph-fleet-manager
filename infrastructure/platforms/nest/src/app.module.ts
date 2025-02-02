import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { BikeModule } from './bike/bike.module';
import { BreakdownModule } from './breakdown/breakdown.module';
import { DriverModule } from './driver/driver.module';
import { TrialModule } from './trial/trial.module';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    MaintenanceModule,
    BikeModule,
    BreakdownModule,
    DriverModule,
    TrialModule,
    IncidentModule,
  ],
})
export class AppModule {}
