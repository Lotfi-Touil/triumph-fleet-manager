import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@domain/entities/User';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles); 