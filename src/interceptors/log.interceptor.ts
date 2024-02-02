import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from '../module/log/log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private logService: LogService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const dt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();

        this.logService.logMessage(
          'info',
          `URL: ${request.url} - Method: ${request.method} - Execution time: ${
            Date.now() - dt
          } ms`,
        );
      }),
    );
  }
}
