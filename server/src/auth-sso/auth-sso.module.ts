import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthSsoController } from './auth-sso.controller';
import { GoogleStrategy, GithubStrategy } from './strategy';

@Module({
  imports: [AuthModule],
  providers: [GoogleStrategy, GithubStrategy],
  controllers: [AuthSsoController],
})
export class AuthSsoModule {}
