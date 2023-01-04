import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <html>
      <body>
      <h1>Hello World from Nest!</h1>
      <div>
        <a href="http://localhost:8080/auth/google">Google Login</a>
      </div>
      </body>
    </html>`;
  }
}
