import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User as DomainUser } from "../../../../domain/entities/User";
import { UserRepository } from "../../../../domain/repositories/UserRepository";
import { User } from "../../../platforms/nest/src/users/entities/user.entity";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findById(id: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? user.toDomain() : null;
  }

  async save(domainUser: DomainUser): Promise<DomainUser> {
    const user = User.fromDomain(domainUser);
    const savedUser = await this.repository.save(user);
    return savedUser.toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
