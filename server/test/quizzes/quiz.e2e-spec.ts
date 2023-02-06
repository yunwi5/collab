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
import { find } from 'lodash';
import { signUpAndIn } from '../auth/auth.e2e.util';
import {
  CREATE_QUIZ_MUTATION,
  CREATE_QUIZ_OPERATION_NAME,
  FIND_QUIZZES_BY_TOPIC_OPERATION_NAME,
  FIND_QUIZZES_BY_TOPIC_QUERY,
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
  let quizA: Quiz;
  let quizB: Quiz;

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);

    const authResponse = await signUpAndIn(app);
    user = authResponse.user;
    access_token = authResponse.access_token;
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  it('Should create a quiz', async () => {
    const { createQuizInput: createQuizInputA } = generateCreateQuizData(false);
    const { createQuizInput: createQuizInputB } = generateCreateQuizData(false);

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: CREATE_QUIZ_OPERATION_NAME,
        query: CREATE_QUIZ_MUTATION,
        variables: { createQuizInput: createQuizInputA },
      })
      .expect(200)
      .expect(res => {
        quizA = res.body.data.createQuiz;
        expect(quizA).toBeDefined();
        expect(quizA.name).toEqual(createQuizInputA.name);
        expect(quizA.level).toEqual(createQuizInputA.level);
        expect(quizA.passScore).toEqual(createQuizInputA.passScore);
        expect(quizA.creator).toMatchObject({
          userId: user.userId,
          username: user.username,
        });
      });

    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: CREATE_QUIZ_OPERATION_NAME,
        query: CREATE_QUIZ_MUTATION,
        variables: { createQuizInput: createQuizInputB },
      })
      .expect(200)
      .expect(res => {
        quizB = res.body.data.createQuiz;
        expect(quizB).toBeDefined();
        expect(quizB.name).toEqual(createQuizInputB.name);
        expect(quizB.level).toEqual(createQuizInputB.level);
        expect(quizB.passScore).toEqual(createQuizInputB.passScore);
        expect(quizB.creator).toMatchObject({
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

  it('Should get all quizzes by topic', async () => {
    const promises = [quizA, quizB].map(quiz => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: FIND_QUIZZES_BY_TOPIC_OPERATION_NAME,
          query: FIND_QUIZZES_BY_TOPIC_QUERY,
          variables: { topic: quiz.topic },
        })
        .expect(200)
        .expect(res => {
          const quizzesFound: Quiz[] = res.body.data.quizzesByTopic;
          expect(find(quizzesFound, ['quizId', quiz.quizId])).toBeDefined();
        });
    });

    await Promise.all(promises);
  });

  it('Should get a quiz', () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: FIND_QUIZ_OPERATION_NAME,
        query: FIND_QUIZ_QUERY,
        variables: { creatorId: quizA.creatorId, quizId: quizA.quizId },
      })
      .expect(200)
      .expect(res => {
        const quizFound: Quiz = res.body.data.quiz;
        expect(quizFound).toMatchObject(quizA);
      });
  });

  it('Should update the quiz', () => {
    const { updateQuizInput } = generateUpdateQuizData(quizA.quizId);

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
        quizA = res.body.data.updateQuiz;
        expect(quizA).toBeDefined();
        expect(quizA.name).toEqual(updateQuizInput.name);
        expect(quizA.level).toEqual(updateQuizInput.level);
        expect(quizA.passScore).toEqual(updateQuizInput.passScore);
      });
  });

  it('Should vote the quiz', () => {
    const { createVoteInput } = generateVoteQuizData(quizA);

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
        quizA = res.body.data.voteQuiz;
        expect(quizA.votes).toBeDefined();
        const expectedVote = quizA.votes.find(
          vote => vote.userId === user.userId,
        );
        expect(expectedVote.type).toBe(createVoteInput.type.toLowerCase());
      });
  });

  it('Should comment on the quiz', () => {
    const { createCommentInput } = generateCreateCommentData({
      parentId: quizA.quizId,
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
        expect(comment.parentId).toEqual(quizA.quizId);
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
        variables: { quizId: quizA.quizId },
      })
      .expect(200)
      .expect(res => {
        const deletedQuiz: Quiz = res.body.data.removeQuiz;
        expect(deletedQuiz).toBeDefined();
        expect(quizA.quizId).toEqual(deletedQuiz.quizId);
        expect(quizA.name).toEqual(deletedQuiz.name);
      });

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: FIND_QUIZ_OPERATION_NAME,
        query: FIND_QUIZ_QUERY,
        variables: { creatorId: quizA.creator.userId, quizId: quizA.quizId },
      })
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.data).toBeNull();
      });
  });
});
