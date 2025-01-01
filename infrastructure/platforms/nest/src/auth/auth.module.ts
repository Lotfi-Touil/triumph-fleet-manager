import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { SignupUser } from '@application/usecases/SignupUser';
import { LoginUser } from '@application/usecases/LoginUser';
import { BcryptHashService } from '@infrastructure/adapters/services/BcryptHashService';
import { JwtAuthenticationService } from '@infrastructure/adapters/services/JwtAuthenticationService';
import { PostgresUserRepository } from '@infrastructure/adapters/repositories/PostgresUserRepository';
import { UserEntity } from '@infrastructure/adapters/repositories/typeorm/entities/UserEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: PostgresUserRepository,
    },
    {
      provide: 'IHashService',
      useClass: BcryptHashService,
    },
    {
      provide: 'IAuthenticationService',
      useClass: JwtAuthenticationService,
    },
    {
      provide: SignupUser,
      useFactory: (userRepo, hashService) => {
        return new SignupUser(userRepo, hashService);
      },
      inject: ['IUserRepository', 'IHashService'],
    },
    {
      provide: LoginUser,
      useFactory: (userRepo, hashService, authService) => {
        return new LoginUser(userRepo, hashService, authService);
      },
      inject: ['IUserRepository', 'IHashService', 'IAuthenticationService'],
    },
  ],
})
export class AuthModule {}
