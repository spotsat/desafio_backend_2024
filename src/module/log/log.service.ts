import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './log-entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  async logMessage(level: string, message: string): Promise<void> {
    const log = this.logRepository.create({ level, message });
    await this.logRepository.save(log);
  }

  async logInfo(message: string): Promise<void> {
    const log = this.logRepository.create({ level: 'info', message });
    await this.logRepository.save(log);
  }

  async logWarn(message: string): Promise<void> {
    const log = this.logRepository.create({ level: 'warn', message });
    await this.logRepository.save(log);
  }

  async logError(message: string): Promise<void> {
    const log = this.logRepository.create({ level: 'error', message });
    await this.logRepository.save(log);
  }

  async getLogs(): Promise<LogEntity[]> {
    return await this.logRepository.find();
  }

  // Métodos para info, warn, error, etc., podem ser adicionados aqui
}
