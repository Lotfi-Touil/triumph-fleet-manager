import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
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

  toDomain(): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
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
    return entity;
  }
}
