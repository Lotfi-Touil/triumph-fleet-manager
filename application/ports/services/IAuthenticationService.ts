export interface IAuthenticationService {
  generateToken(payload: Record<string, any>): string;
  verifyToken(token: string): Record<string, any>;
}
