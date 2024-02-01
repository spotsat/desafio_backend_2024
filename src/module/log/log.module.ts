import { Module, forwardRef } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './log-entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
