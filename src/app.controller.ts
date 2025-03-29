import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/healthz')
  health() {
    return 'healty';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/env')
  env() {
    return this.configService.get<string>('NODE_VERSION');
  }
}
