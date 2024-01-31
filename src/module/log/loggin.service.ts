import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './loggin-entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(LogEntity)
    private logRepository: Repository<LogEntity>,
  ) {}

  async logMessage(level: string, message: string): Promise<void> {
    const log = this.logRepository.create({ level, message });
    await this.logRepository.save(log);
  }

  async getLogs(): Promise<LogEntity[]> {
    return await this.logRepository.find();
  }

  // Métodos para info, warn, error, etc., podem ser adicionados aqui
}
