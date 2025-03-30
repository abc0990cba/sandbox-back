import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from 'src/auth/jwt-auth.service';
import { Response, Request } from 'express';
import { GoogleOauthGuard } from './google-oauth.guard';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  googleAuth(@Req() req: Request) {
    return req.user;
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = this.jwtAuthService.login(req.user);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      // sameSite: 'lax',
      sameSite: 'none',
      secure: true,
    });

    res.redirect('https://sandbox-front.vercel.app/');
    // res.redirect('http://localhost:3001/');
    // return req.user;
  }
}
