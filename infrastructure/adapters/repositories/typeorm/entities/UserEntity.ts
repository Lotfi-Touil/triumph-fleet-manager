import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User, UserRole } from "../../../../../domain/entities/User";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toDomain(): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  static fromDomain(user: User): UserEntity {
    const entity = new UserEntity();
    const userData = user.toJSON();
    entity.id = userData.id;
    entity.email = userData.email;
    entity.password = userData.password;
    entity.name = userData.name;
    entity.role = userData.role;
    entity.createdAt = userData.createdAt;
    entity.updatedAt = userData.updatedAt;
    return entity;
  }
}
