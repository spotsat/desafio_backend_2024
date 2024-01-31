import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { LoggingService } from 'src/module/log/loggin.service'; // Ajuste o caminho conforme necessário

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.loggingService.logMessage(
          'info',
          `${request.method} ${request.url} - ${duration}ms - Status: ${response.statusCode}`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.loggingService.logMessage(
          'error',
          `${request.method} ${request.url} - ${duration}ms - Error: ${error.response || error.message}`,
        );
        throw error;
      }),
    );
  }
}
