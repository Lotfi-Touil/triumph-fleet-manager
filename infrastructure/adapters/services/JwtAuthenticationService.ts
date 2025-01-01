import { IAuthenticationService } from "../../../application/ports/services/IAuthenticationService";
import * as jwt from "jsonwebtoken";

export class JwtAuthenticationService implements IAuthenticationService {
  private readonly secretKey: string =
    process.env.JWT_SECRET || "your-secret-key";

  generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: "24h" });
  }

  verifyToken(token: string): Record<string, any> {
    try {
      return jwt.verify(token, this.secretKey) as Record<string, any>;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
