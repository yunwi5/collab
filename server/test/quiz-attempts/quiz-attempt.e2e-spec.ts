import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { createRandomQuiz } from 'test/quizzes/quiz.e2e.util';
import { E2eTestUtil } from 'test/e2e-test.util';
import { find } from 'lodash';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { QuizAttempt } from 'src/quiz-attempts/entities';
import { User } from 'src/users/entities';
import {
  FIND_QUIZ_ATTEMPTS_BY_QUIZ_OPERATION_NAME,
  FIND_QUIZ_ATTEMPTS_BY_QUIZ_QUERY,
  FIND_QUIZ_ATTEMPTS_BY_USER_OPERATION_NAME,
  FIND_QUIZ_ATTEMPTS_BY_USER_QUERY,
  FIND_QUIZ_ATTEMPT_OPERATION_NAME,
  FIND_QUIZ_ATTEMPT_QUERY,
  SUBMIT_QUIZ_ATTEMPT_MUTATION,
  SUBMIT_QUIZ_ATTEMPT_OPERATION_NAME,
  generateSubmitQuizAttemptData,
} from './quiz-attempt.helper';

describe('Quiz resolver (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let user: User;
  let quiz: Quiz;

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);

    const authResponse = await signUpAndIn(app);
    access_token = authResponse.access_token;
    user = authResponse.user;

    quiz = await createRandomQuiz(app, access_token, true);
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  it('Should create a quiz attempt', async () => {
    const { quizAttemptInput } = generateSubmitQuizAttemptData(quiz);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: SUBMIT_QUIZ_ATTEMPT_OPERATION_NAME,
        query: SUBMIT_QUIZ_ATTEMPT_MUTATION,
        variables: { quizAttemptInput },
      })
      .expect(200)
      .expect(res => {
        const newAttempt: QuizAttempt = res.body.data.submitQuizAttempt;
        expect(newAttempt).toBeDefined();
        expect(newAttempt).toMatchObject(quizAttemptInput);

        expect([true, false]).toContain(newAttempt.pass);
        expect(newAttempt.scorePercentage).toBeGreaterThan(0);
        expect(newAttempt.scorePercentage).toBeWithin(0, 101);
      });
  });

  it('Should retrieve a quiz attempt', async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: FIND_QUIZ_ATTEMPT_OPERATION_NAME,
        query: FIND_QUIZ_ATTEMPT_QUERY,
        variables: { quizId: quiz.quizId, userId: user.userId },
      })
      .expect(200)
      .expect(res => {
        const { quizAttempt } = res.body.data;
        expect(quizAttempt).toBeDefined();
        expect(quizAttempt).toMatchObject({
          quizId: quiz.quizId,
          userId: user.userId,
          creatorId: quiz.creatorId,
        });
      });
  });

  it('Should retrieve quiz attempts by quiz', async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: FIND_QUIZ_ATTEMPTS_BY_QUIZ_OPERATION_NAME,
        query: FIND_QUIZ_ATTEMPTS_BY_QUIZ_QUERY,
        variables: { quizId: quiz.quizId },
      })
      .expect(200)
      .expect(res => {
        const quizAttempts: QuizAttempt[] = res.body.data.quizAttemptsByQuiz;
        expect(Array.isArray(quizAttempts)).toBe(true);

        const userAttempt = find(quizAttempts, ['userId', user.userId]);
        expect(userAttempt).toBeDefined();
      });
  });

  it('Should retrieve quiz attempts by user', async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        operationName: FIND_QUIZ_ATTEMPTS_BY_USER_OPERATION_NAME,
        query: FIND_QUIZ_ATTEMPTS_BY_USER_QUERY,
        variables: { userId: user.userId },
      })
      .expect(200)
      .expect(res => {
        const userQuizAttempts: QuizAttempt[] =
          res.body.data.quizAttemptsByUser;
        expect(Array.isArray(userQuizAttempts)).toBe(true);

        const userAttemptOnQuiz = find(userQuizAttempts, [
          'quizId',
          quiz.quizId,
        ]);
        expect(userAttemptOnQuiz).toBeDefined();
      });
  });

  it('Should replace an existing question attempt', async () => {
    const quizReAttemptInput =
      generateSubmitQuizAttemptData(quiz).quizAttemptInput;

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: SUBMIT_QUIZ_ATTEMPT_OPERATION_NAME,
        query: SUBMIT_QUIZ_ATTEMPT_MUTATION,
        variables: { quizAttemptInput: quizReAttemptInput },
      })
      .expect(200)
      .expect(res => {
        const newAttempt: QuizAttempt = res.body.data.submitQuizAttempt;
        expect(newAttempt).toBeDefined();
        expect(newAttempt).toMatchObject(quizReAttemptInput);
      });
  });
});
