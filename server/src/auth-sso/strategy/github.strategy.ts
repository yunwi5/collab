import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { envConfig } from 'src/config/env.config';
import { SsoUserInput } from '../dto';
import { AuthProvider } from '../auth-sso.enum';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: envConfig.GithubClientId,
      clientSecret: envConfig.GithubClientSecret,
      callbackURL: envConfig.GithubAuthCallback,
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    console.log(profile);
    const { id: sub, username, displayName, emails, photos } = profile;

    const user: SsoUserInput = {
      provider: AuthProvider.GITHUB,
      email: emails[0].value,
      sub,
      username: `${AuthProvider.GITHUB}#${username}`,
      displayName,
      picture: photos.length > 0 ? photos[0].value : undefined,
    };

    done(null, user);
  }
}
