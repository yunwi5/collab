import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

export const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export class E2eTestUtil {
  public static readonly instance = new E2eTestUtil();

  public async beforeAll(testName: string): Promise<INestApplication> {
    jest.setTimeout(3000);

    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const app = moduleFixture.createNestApplication();
      await app.init();
      return app;
    } catch (err) {
      console.error(`Error beforeAll for ${testName}. Error: `, err);
      throw err;
    }
  }

  public async afterAll(testName: string, app: INestApplication) {
    try {
      await sleep(2000);
      await app.close();
    } catch (err) {
      console.error(`ERROR ON APP CLOSE for ${testName}. Error: `, err);
      throw err;
    }
    await sleep(2000);
  }
}
