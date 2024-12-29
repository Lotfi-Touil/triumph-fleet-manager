import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { HashService } from "../../../application/src/services/HashService";

@Injectable()
export class BcryptHashService implements HashService {
  private readonly saltRounds = 10;

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
