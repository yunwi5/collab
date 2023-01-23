import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from 'src/users/entities';
import {
  CREATE_USER_MUTATION,
  CREATE_USER_OPERATION_NAME,
  generateCreateUserVariables,
} from './create.user.helper';
import { GET_USERS_OPERATION_NAME, GET_USERS_QUERY } from './get.users.helper';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Users resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should get users', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: GET_USERS_OPERATION_NAME,
        query: GET_USERS_QUERY,
      })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body.data.users)).toBe(true);
      });
  });

  describe('Create user', () => {
    it('Should create an user with user mutation', () => {
      const createUserInput = generateCreateUserVariables().createUserInput;

      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          operationName: CREATE_USER_OPERATION_NAME,
          query: CREATE_USER_MUTATION,
          variables: { createUserInput },
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.createUser).toBeDefined();
          user = res.body.data.createUser;
          expect(user.userId).toBeDefined();
          expect(user.username).toBe(createUserInput.username);
          expect(user.email).toBe(createUserInput.email);
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
