import { Module } from '@nestjs/common';
import { LoggingService } from './loggin.service';

@Module({
  imports: [],
  controllers: [],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LogginModule {}
