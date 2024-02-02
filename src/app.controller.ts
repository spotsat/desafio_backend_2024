import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    description: 'Welcome to the api that manipulates geographic graphs!',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
