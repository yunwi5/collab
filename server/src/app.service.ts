import { Injectable } from '@nestjs/common';
import { envConfig } from './config/env-config';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <html>
      <body>
      <h1>Hello World from Nest!</h1>
      <div>
        <a href="${envConfig.ServerURL}/auth/google">Google Login</a>
      </div>
      <br >
      <div>
        <a href="${envConfig.ServerURL}/auth/github">Github Login</a>
      </div>
      </body>
    </html>`;
  }
}
