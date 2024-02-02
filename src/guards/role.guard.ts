import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { LogService } from '../module/log/log.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logService: LogService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    const rolesFiltered = requiredRoles.filter((role) => role === user.role);

    if (rolesFiltered.length === 0) {
      this.logService.logMessage(
        'error',
        `User ${user.id} does not have permission to access this route`,
      );
    }

    return rolesFiltered.length > 0;
  }
}
