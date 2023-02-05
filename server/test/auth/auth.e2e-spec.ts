import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { E2eTestUtil } from 'test/e2e-test.util';
import {
  SIGN_UP_MUTATION,
  SIGN_UP_OPERATION_NAME,
  generateInvalidSignUpVariables,
  generateSignUpVariables,
} from './signup.helper';

import { SIGN_IN_MUTATION, SIGN_IN_OPERATION_NAME } from './signin.helper';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Auth resolver (e2e)', () => {
  let app: INestApplication;
  let userCredentials: { username: string; password: string };

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  it('Should sign up user', () => {
    const { signUpInput } = generateSignUpVariables();
    userCredentials = {
      username: signUpInput.username,
      password: signUpInput.password,
    };

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGN_UP_OPERATION_NAME,
        query: SIGN_UP_MUTATION,
        variables: { signUpInput },
      })
      .expect(200)
      .expect(res => {
        const user = res.body.data.signUp;
        expect(user).toBeDefined();
        expect(user.email).toEqual(signUpInput.email);
        expect(user.username).toEqual(signUpInput.username);
        expect(user.displayName).toBeDefined();
      });
  });

  it('cannot sign up user with invalid input', () => {
    const { signUpInput } = generateInvalidSignUpVariables();

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGN_UP_OPERATION_NAME,
        query: SIGN_UP_MUTATION,
        variables: { signUpInput },
      })
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.data).toBeNull();
      });
  });

  it('Should sign in user', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGN_IN_OPERATION_NAME,
        query: SIGN_IN_MUTATION,
        variables: { signInInput: userCredentials },
      })
      .expect(200)
      .expect(res => {
        const { access_token, user } = res.body.data.signIn;
        expect(access_token).toBeDefined();
        expect(user).toBeDefined();
        expect(user.displayName).toBeDefined();
      });
  });

  it('Cannot sign in with invalid credentials', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: SIGN_IN_OPERATION_NAME,
        query: SIGN_IN_MUTATION,
        variables: {
          signInInput: { ...userCredentials, password: 'wrong-password' },
        },
      })
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.data).toBeNull();
      });
  });
});
