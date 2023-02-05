import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import {
  CREATE_QUIZ_MUTATION,
  CREATE_QUIZ_OPERATION_NAME,
  FIND_QUIZ_OPERATION_NAME,
  FIND_QUIZ_QUERY,
  generateCreateQuizData,
} from './quiz.helper';

export const createRandomQuiz = async (
  app: INestApplication,
  access_token: string,
  shouldCreateQuestions = false,
) => {
  let quiz: Quiz;
  const { createQuizInput } = generateCreateQuizData(shouldCreateQuestions);

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

export const findQuiz = async (props: {
  app: INestApplication;
  access_token: string;
  creatorId: string;
  quizId: string;
}) => {
  const { app, access_token, creatorId, quizId } = props;
  let quiz: Quiz;

  await request(app.getHttpServer())
    .post(GRAPHQL_ENDPOINT)
    .auth(access_token, { type: 'bearer' })
    .send({
      operationName: FIND_QUIZ_OPERATION_NAME,
      query: FIND_QUIZ_QUERY,
      variables: { creatorId, quizId },
    })
    .expect(200)
    .expect(res => {
      quiz = res.body.data.quiz;
    });

  return quiz;
};
