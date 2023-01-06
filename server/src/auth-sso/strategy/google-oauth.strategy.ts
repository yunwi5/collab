import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { envConfig } from 'src/config/env.config';
import { SsoUserInput } from '../dto';
import { AuthProvider } from '../auth-sso.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envConfig.GoogleClientId,
      clientSecret: envConfig.GoogleClientSecret,
      callbackURL: envConfig.GoogleAuthCallback,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
    const { sub, displayName, name, emails, picture } = profile;
    const username = `${name.givenName} ${name.familyName}`;

    const user: SsoUserInput = {
      provider: AuthProvider.GOOGLE,
      email: emails[0].value,
      sub,
      username: `${AuthProvider.GOOGLE}#${username}`,
      displayName,
      picture,
    };

    done(null, user);
  }
}
