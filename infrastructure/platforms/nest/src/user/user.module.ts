import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../../../infrastructure/adapters/repositories/typeorm/entities/UserEntity';
import { ProfileController } from './profile.controller';
import { AdminController } from './admin.controller';
import { UserController } from './user.controller';
import { PostgresUserRepository } from '../../../../../infrastructure/adapters/repositories/PostgresUserRepository';
import { UpdateUserProfile } from '../../../../../application/usecases/UpdateUserProfile';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { NestUserService } from './user.service';
import { CreateUser } from '@application/usecases/CreateUser';
import { UpdateUser } from '@application/usecases/UpdateUser';
import { DeleteUser } from '@application/usecases/DeleteUser';
import { GetUsers } from '@application/usecases/GetUsers';
import { ValidateUserCredentials } from '@application/usecases/ValidateUserCredentials';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [ProfileController, AdminController, UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: PostgresUserRepository,
    },
    {
      provide: 'UserRepository',
      useClass: PostgresUserRepository,
    },
    UpdateUserProfile,
    {
      provide: 'UserService',
      useClass: NestUserService,
    },
    CreateUser,
    UpdateUser,
    DeleteUser,
    GetUsers,
    ValidateUserCredentials,
  ],
  exports: ['IUserRepository', 'UserRepository', 'UserService'],
})
export class UserModule {}
