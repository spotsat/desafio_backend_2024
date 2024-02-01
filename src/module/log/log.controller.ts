import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('logs')
export class LogController {
  constructor(private readonly loggingService: LogService) {}

  @Get()
  async getLogs() {
    return this.loggingService.getLogs();
  }
}
