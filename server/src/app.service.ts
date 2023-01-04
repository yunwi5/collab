import { Injectable } from '@nestjs/common';
import { isProduction } from './utils';

@Injectable()
export class AppService {
  getHello(): string {
    const baseUrl = isProduction() ? 'prod' : '';

    return `
    <html>
      <body>
      <h1>Hello World from Nest!</h1>
      <div>
        <a href="${baseUrl}/auth/google">Google Login</a>
      </div>
      <br >
      <div>
        <a href="${baseUrl}/auth/github">Github Login</a>
      </div>
      </body>
    </html>`;
  }
}
