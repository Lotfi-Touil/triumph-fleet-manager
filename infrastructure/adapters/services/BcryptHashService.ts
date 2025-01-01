import { IHashService } from "../../../application/ports/services/IHashService";
import * as bcrypt from "bcrypt";

export class BcryptHashService implements IHashService {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(data, hashed);
  }
}
