import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { User } from 'src/users/entities';
import { E2eTestUtil } from 'test/e2e-test.util';
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

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
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
      const { createUserInput } = generateCreateUserVariables();

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
});
