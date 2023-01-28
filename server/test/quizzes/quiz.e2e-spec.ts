import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { signUpAndIn } from '../auth/auth.util';
import { User } from 'src/users/entities';
import {
  CREATE_QUIZ_MUTATION,
  CREATE_QUIZ_OPERATION_NAME,
  FIND_QUIZZES_OPERATION_NAME,
  FIND_QUIZZES_QUERY,
  FIND_QUIZ_OPERATION_NAME,
  FIND_QUIZ_QUERY,
  REMOVE_QUIZ_MUTATION,
  REMOVE_QUIZ_OPERATION_NAME,
  UPDATE_QUIZ_MUTATION,
  UPDATE_QUIZ_OPERATION_NAME,
  generateCreateQuizData,
  generateUpdateQuizData,
} from './quiz.helper';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

describe('Quiz resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let access_token: string;
  let quiz: Quiz;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await signUpAndIn(app);
    user = authResponse.user;
    access_token = authResponse.access_token;
  });

  it('Should create a quiz', () => {
    const createQuizInput = generateCreateQuizData().createQuizInput;

    return request(app.getHttpServer())
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
        expect(quiz).toBeDefined();
        expect(quiz.name).toEqual(createQuizInput.name);
        expect(quiz.level).toEqual(createQuizInput.level);
        expect(quiz.passScore).toEqual(createQuizInput.passScore);
        expect(quiz.creator).toMatchObject({
          userId: user.userId,
          username: user.username,
        });
      });
  });

  it('Should get all quizzes', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: FIND_QUIZZES_OPERATION_NAME,
        query: FIND_QUIZZES_QUERY,
      })
      .expect(200)
      .expect(res => {
        const quizzes: Quiz[] = res.body.data.quizzes;
        expect(Array.isArray(quizzes)).toBe(true);
        expect(quizzes.length).toBeGreaterThanOrEqual(1);
      });
  })

  it('Should update the quiz', () => {
    const updateQuizInput = generateUpdateQuizData(quiz.quizId).updateQuizInput;

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: UPDATE_QUIZ_OPERATION_NAME,
        query: UPDATE_QUIZ_MUTATION,
        variables: { updateQuizInput },
      })
      .expect(200)
      .expect(res => {
        quiz = res.body.data.updateQuiz;
        expect(quiz).toBeDefined();
        expect(quiz.name).toEqual(updateQuizInput.name);
        expect(quiz.level).toEqual(updateQuizInput.level);
        expect(quiz.passScore).toEqual(updateQuizInput.passScore);
      });
  });

  it('Should delete the quiz', async () => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: REMOVE_QUIZ_OPERATION_NAME,
        query: REMOVE_QUIZ_MUTATION,
        variables: { quizId: quiz.quizId },
      })
      .expect(200)
      .expect(res => {
        const deletedQuiz: Quiz = res.body.data.removeQuiz;
        expect(deletedQuiz).toBeDefined();
        expect(quiz.quizId).toEqual(deletedQuiz.quizId);
        expect(quiz.name).toEqual(deletedQuiz.name);
      });

      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: FIND_QUIZ_OPERATION_NAME,
        query: FIND_QUIZ_QUERY,
        variables: { creatorId: quiz.creator.userId, quizId: quiz.quizId },
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
