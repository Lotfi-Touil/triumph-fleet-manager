import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  TokenService,
  TokenPayload,
} from "../../../application/src/services/TokenService";

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token);
  }
}
