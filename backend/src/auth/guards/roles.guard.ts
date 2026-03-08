import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/interfaces/entities.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      console.log('RolesGuard: Request user is empty! Access Denied.');
      return false;
    }

    const userRoleStr = String(user.role).toUpperCase();
    console.log(`RolesGuard: Checking access for UserID: ${user.userId}, Role: [${userRoleStr}]`);
    console.log(`RolesGuard: Required Roles for Path [${context.switchToHttp().getRequest().url}]: ${requiredRoles}`);

    // Admin override
    if (userRoleStr === 'ADMIN') {
      console.log('RolesGuard: Admin Override - Access GRANTED');
      return true;
    }

    const hasRole = requiredRoles.some((role) => String(role).toUpperCase() === userRoleStr);
    console.log(`RolesGuard: Match result: ${hasRole ? 'GRANTED' : 'DENIED (Role mismatch)'}`);
    return hasRole;
  }
}
