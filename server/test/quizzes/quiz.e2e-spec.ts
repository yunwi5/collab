import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { User } from 'src/users/entities';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import {
  CREATE_COMMENT_MUTATION,
  CREATE_COMMENT_OPERATION_NAME,
  generateCreateCommentData,
} from 'test/comments/comment.helper';
import { E2eTestUtil } from 'test/e2e-test.util';
import { signUpAndIn } from '../auth/auth.e2e.util';
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
  VOTE_QUIZ_MUTATION,
  VOTE_QUIZ_OPERATION_NAME,
  generateCreateQuizData,
  generateUpdateQuizData,
  generateVoteQuizData,
} from './quiz.helper';

describe('Quiz resolver (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let access_token: string;
  let quiz: Quiz;

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);

    const authResponse = await signUpAndIn(app);
    user = authResponse.user;
    access_token = authResponse.access_token;
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  it('Should create a quiz', () => {
    const { createQuizInput } = generateCreateQuizData(false);

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
        const { quizzes }: { quizzes: Quiz[] } = res.body.data;
        expect(Array.isArray(quizzes)).toBe(true);
        expect(quizzes.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('Should get a quiz', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: FIND_QUIZ_OPERATION_NAME,
        query: FIND_QUIZ_QUERY,
        variables: { creatorId: quiz.creatorId, quizId: quiz.quizId },
      })
      .expect(200)
      .expect(res => {
        const quizFound: Quiz = res.body.data.quiz;
        expect(quizFound).toMatchObject(quiz);
      });
  });

  it('Should update the quiz', () => {
    const { updateQuizInput } = generateUpdateQuizData(quiz.quizId);

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

  it('Should vote the quiz', () => {
    const { createVoteInput } = generateVoteQuizData(quiz);

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: VOTE_QUIZ_OPERATION_NAME,
        query: VOTE_QUIZ_MUTATION,
        variables: { createVoteInput },
      })
      .expect(200)
      .expect(res => {
        quiz = res.body.data.voteQuiz;
        expect(quiz.votes).toBeDefined();
        const expectedVote = quiz.votes.find(
          vote => vote.userId === user.userId,
        );
        expect(expectedVote.type).toBe(createVoteInput.type.toLowerCase());
      });
  });

  it('Should comment on the quiz', () => {
    const { createCommentInput } = generateCreateCommentData({
      parentId: quiz.quizId,
    });

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: CREATE_COMMENT_OPERATION_NAME,
        query: CREATE_COMMENT_MUTATION,
        variables: { createCommentInput },
      })
      .expect(200)
      .expect(res => {
        const comment = res.body.data.createComment;
        expect(comment.parentId).toEqual(quiz.quizId);
        expect(comment.content).toEqual(createCommentInput.content);
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
});
