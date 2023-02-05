import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { GithubGuard, GoogleOauthGuard } from './guards';

@Controller('auth')
export class AuthSsoController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // this endpoint will redirect the user to the Google login page
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req) {
    return this.authService.ssoSignIn(req.user);
  }

  @Get('github')
  @UseGuards(GithubGuard)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubAuthCallback(@Req() req) {
    // this endpoint will redirect the user to the Github login page
    return this.authService.ssoSignIn(req.user);
  }
}
