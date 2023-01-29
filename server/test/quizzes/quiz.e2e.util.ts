import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import {
  CREATE_QUIZ_MUTATION,
  CREATE_QUIZ_OPERATION_NAME,
  FIND_QUIZ_OPERATION_NAME,
  FIND_QUIZ_QUERY,
  generateCreateQuizData,
} from './quiz.helper';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

export const createRandomQuiz = async (
  app: INestApplication,
  access_token: string,
  shouldCreateQuestions: boolean = false,
) => {
  let quiz: Quiz;
  const createQuizInput = generateCreateQuizData(shouldCreateQuestions).createQuizInput;

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
      variables: { creatorId: creatorId, quizId: quizId },
    })
    .expect(200)
    .expect(res => {
      quiz = res.body.data.quiz;
    });

  return quiz;
};
