import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../module/auth/auth.service';
import { UserService } from '../module/user/user.service';
import { LogService } from '../module/log/log.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logService: LogService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const data = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.tokenPayload = data;

      request.user = await this.userService.show(data.id);

      return true;
    } catch (error) {
      this.logService.logMessage('error', `Invalid token: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
