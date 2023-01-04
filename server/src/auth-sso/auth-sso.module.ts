import { Module } from '@nestjs/common';
import { AuthSsoController } from './auth-sso.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleStrategy } from './strategy/google-oauth.strategy';

@Module({
  imports: [AuthModule],
  providers: [GoogleStrategy],
  controllers: [AuthSsoController],
})
export class AuthSsoModule {}
