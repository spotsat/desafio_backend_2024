import { Controller, UseGuards } from '@nestjs/common';
import { LoggingService } from './loggin.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('logs')
export class LogController {
  constructor(private readonly loggingService: LoggingService) {}

  Get() {
    return this.loggingService.getLogs();
  }
}
