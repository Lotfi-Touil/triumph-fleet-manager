import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      this.logger.debug('Headers:', request.headers);

      const result = (await super.canActivate(context)) as boolean;

      if (!result) {
        this.logger.error('JWT validation failed');
        throw new UnauthorizedException('Invalid token');
      }

      const user = request.user;
      this.logger.debug('User from JWT:', user);

      if (!user || !user.id) {
        this.logger.error('No user or user ID in JWT payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      return true;
    } catch (error) {
      this.logger.error(
        `JWT authentication failed: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
