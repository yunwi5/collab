import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { createRandomQuiz } from 'test/quizzes/quiz.e2e.util';
import { E2eTestUtil } from 'test/e2e-test.util';
import { find } from 'lodash';
import {
  FIND_QUIZ_ATTEMPTS_BY_QUIZ_OPERATION_NAME,
  FIND_QUIZ_ATTEMPTS_BY_QUIZ_QUERY,
  FIND_QUIZ_ATTEMPTS_BY_USER_OPERATION_NAME,
  FIND_QUIZ_ATTEMPTS_BY_USER_QUERY,
  SUBMIT_QUIZ_ATTEMPT_MUTATION,
  SUBMIT_QUIZ_ATTEMPT_OPERATION_NAME,
  generateSubmitQuizAttemptData,
} from './quiz-attempt.helper';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { QuizAttempt } from 'src/quiz-attempts/entities';
import { User } from 'src/users/entities';

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
    const quizAttemptInput =
      generateSubmitQuizAttemptData(quiz).quizAttemptInput;

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
        const attempt: QuizAttempt = res.body.data.submitQuizAttempt;
        expect(attempt).toBeDefined();
        expect(Array.isArray(attempt.answers)).toBe(true);
        // TODO: Do more validations
      });
  });

  it('Should retrieve a quiz attempt', async () => {
    // TODO
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
        console.log('userQuizAttempts', userQuizAttempts);
        expect(Array.isArray(userQuizAttempts)).toBe(true);

        const userAttemptOnQuiz = find(userQuizAttempts, [
          'quizId',
          quiz.quizId,
        ]);
        expect(userAttemptOnQuiz).toBeDefined();
      });
  });

  it('Should replace an existing question attempt', async () => {
    // TODO
  });
});
