import { IUserRepository } from "@application/ports/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { v4 as uuidv4 } from "uuid";

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    const userToSave = user.toJSON();
    if (!userToSave.id) {
      userToSave.id = uuidv4();
    }
    const savedUser = new User(userToSave);
    this.users.set(userToSave.id, savedUser);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
