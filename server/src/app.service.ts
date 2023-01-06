import { Injectable } from '@nestjs/common';
import { envConfig } from './config/env.config';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <html>
      <body>
      <h1>Hello World from Nest!</h1>
      <div>
        <p>${envConfig.GoogleAuthCallback}</p>
        <p>${envConfig.GithubAuthCallback}</p>
      </div>
      <div>
        <a href="auth/google">Google Login</a>
      </div>
      <br >
      <div>
        <a href="auth/github">Github Login</a>
      </div>
      </body>
    </html>`;
  }
}
