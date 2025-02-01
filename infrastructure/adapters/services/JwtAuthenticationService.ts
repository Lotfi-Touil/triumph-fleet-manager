import { IAuthenticationService } from "../../../application/ports/services/IAuthenticationService";
import * as jwt from "jsonwebtoken";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAuthenticationService implements IAuthenticationService {
  private readonly logger = new Logger(JwtAuthenticationService.name);
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>("JWT_SECRET") || "your-secret-key";
  }

  generateToken(payload: Record<string, any>): string {
    const tokenPayload = {
      sub: payload.id,
      email: payload.email,
      role: payload.role,
    };
    this.logger.debug("Generating token with payload:", tokenPayload);
    return jwt.sign(tokenPayload, this.secretKey, { expiresIn: "24h" });
  }

  verifyToken(token: string): Record<string, any> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as Record<string, any>;
      this.logger.debug("Decoded token:", decoded);
      return {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      this.logger.error("Token verification failed:", error);
      throw new Error("Invalid token");
    }
  }
}
