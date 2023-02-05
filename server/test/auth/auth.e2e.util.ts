import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User } from 'src/users/entities';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import {
  SIGN_UP_MUTATION,
  SIGN_UP_OPERATION_NAME,
  generateSignUpVariables,
} from './signup.helper';
import { SIGN_IN_MUTATION, SIGN_IN_OPERATION_NAME } from './signin.helper';

type SignUpInput = {
  username: string;
  email: string;
  password: string;
};

export const signUp = async (
  app: INestApplication,
  signUpInput: SignUpInput,
) => {
  let user: User;

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      operationName: SIGN_UP_OPERATION_NAME,
      query: SIGN_UP_MUTATION,
      variables: { signUpInput },
    })
    .expect(res => {
      user = res.body.data.signUp;
    });

  return user;
};

export const signUpAndIn = async (app: INestApplication) => {
  const { signUpInput } = generateSignUpVariables();
  let authResponse: { access_token: string; user: User };

  await signUp(app, signUpInput);

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .send({
      operationName: SIGN_IN_OPERATION_NAME,
      query: SIGN_IN_MUTATION,
      variables: {
        signInInput: {
          username: signUpInput.username,
          password: signUpInput.password,
        },
      },
    })
    .expect(200)
    .expect(res => {
      const { access_token, user } = res.body.data.signIn;
      authResponse = { access_token, user };
    });

  return authResponse;
};
