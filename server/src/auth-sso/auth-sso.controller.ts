import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthSsoController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // this endpoint will redirect the user to the Google login page
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req) {
    return await this.authService.ssoSignIn(req.user);
  }
}
