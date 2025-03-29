import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.strategy';
import { Request } from 'express';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: Request['user']) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: JwtPayload = { username: user.username, sub: user?.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
