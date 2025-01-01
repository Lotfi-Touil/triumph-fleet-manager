import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserRepository } from "../../../application/ports/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserEntity } from "./typeorm/entities/UserEntity";

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = UserEntity.fromDomain(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return savedEntity.toDomain();
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    return userEntity ? userEntity.toDomain() : null;
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? userEntity.toDomain() : null;
  }
}
