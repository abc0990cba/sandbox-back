import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const accessToken = req.cookies.jwt;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accessToken = req?.user?.['username'] || '';
    console.log('accessToken', accessToken);

    if (accessToken) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { data } = await this.httpService.axiosRef.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      } catch (error) {
        console.error('Error fetching user info from Google:', error);
        return req.user; // Fallback to basic user info
      }
    }

    return req.user;
  }
}
