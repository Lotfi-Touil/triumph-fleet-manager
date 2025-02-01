import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserRepository } from "../../../application/ports/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";
import { UserEntity } from "./typeorm/entities/UserEntity";

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  private readonly logger = new Logger(PostgresUserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async save(user: User): Promise<User> {
    try {
      this.logger.debug("Saving user:", user);
      const userEntity = UserEntity.fromDomain(user);
      const savedEntity = await this.userRepository.save(userEntity);
      return savedEntity.toDomain();
    } catch (error) {
      this.logger.error(`Error saving user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      this.logger.debug(`Finding user by email: ${email}`);
      const userEntity = await this.userRepository.findOne({
        where: { email },
      });
      this.logger.debug("Found user entity:", userEntity);
      return userEntity ? userEntity.toDomain() : null;
    } catch (error) {
      this.logger.error(
        `Error finding user by email: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      this.logger.debug(`Finding user by ID: ${id}`);
      const userEntity = await this.userRepository.findOne({ where: { id } });
      this.logger.debug("Found user entity:", userEntity);
      return userEntity ? userEntity.toDomain() : null;
    } catch (error) {
      this.logger.error(
        `Error finding user by ID: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.debug("Finding all users");
      const userEntities = await this.userRepository.find();
      this.logger.debug(`Found ${userEntities.length} users`);
      return userEntities.map((entity) => entity.toDomain());
    } catch (error) {
      this.logger.error(
        `Error finding all users: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
