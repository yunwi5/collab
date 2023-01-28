import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import {
  SIGN_UP_MUTATION,
  SIGN_UP_OPERATION_NAME,
  generateInvalidSignUpVariables,
  generateSignUpVariables,
} from './signup.helper';

import { SIGN_IN_MUTATION, SIGN_IN_OPERATION_NAME } from './signin.helper';

const GRAPHQL_ENDPOINT = '/graphql';

describe('Auth resolver (e2e)', () => {
  jest.setTimeout(3000);
  let app: INestApplication;
  let userCredentials: { username: string; password: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should sign up user', () => {
    const signUpInput = generateSignUpVariables().signUpInput;
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
    const signUpInput = generateInvalidSignUpVariables().signUpInput;

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

  afterAll(async () => {
    await app.close();
  });
});
