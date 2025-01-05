import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ProfileController } from './profile.controller';
import { PostgresUserRepository } from '../../../adapters/repositories/PostgresUserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PostgresUserRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UserModule {}
