import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import {
  CREATE_QUIZ_MUTATION,
  CREATE_QUIZ_OPERATION_NAME,
  generateCreateQuizData,
} from './quiz.helper';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

export const createTestQuiz = async (
  app: INestApplication,
  access_token: string,
) => {
  let quiz: Quiz;
  const createQuizInput = generateCreateQuizData().createQuizInput;

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .auth(access_token, { type: 'bearer' })
    .send({
      operationName: CREATE_QUIZ_OPERATION_NAME,
      query: CREATE_QUIZ_MUTATION,
      variables: { createQuizInput },
    })
    .expect(200)
    .expect(res => {
      quiz = res.body.data.createQuiz;
    });

  return quiz;
};
