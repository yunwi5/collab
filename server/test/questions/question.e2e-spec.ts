import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { createTestQuiz, findTestQuiz } from 'test/quizzes/quiz.e2e.util';
import {
  CREATE_QUESTION_MUTATION,
  CREATE_QUESTION_OPERATION_NAME,
  REMOVE_QUESTION_MUTATION,
  REMOVE_QUESTION_OPERATION_NAME,
  UPDATE_QUESTION_MUTATION,
  UPDATE_QUESTION_OPERATION_NAME,
  generateCreateQuestionData,
  generateUpdateQuestionData,
} from './question.helper';
import { Question } from 'src/questions/entities';

describe('Quiz resolver (e2e)', () => {
  jest.setTimeout(3000);
  let app: INestApplication;
  let user: User;
  let access_token: string;
  let quiz: Quiz;
  let question: Question;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await signUpAndIn(app);
    user = authResponse.user;
    access_token = authResponse.access_token;

    quiz = await createTestQuiz(app, access_token);
  });

  it('Should create a question', async () => {
    const createQuestionInput = generateCreateQuestionData(
      quiz.quizId,
    ).createQuestionInput;

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: CREATE_QUESTION_OPERATION_NAME,
        query: CREATE_QUESTION_MUTATION,
        variables: { createQuestionInput },
      })
      .expect(200)
      .expect(res => {
        question = res.body.data.createQuestion;
        expect(question).toBeDefined();
        expect(question).toMatchObject(createQuestionInput);
      });
  });

  it('Should batch create question', async () => {
    // TODO
  });

  it('Should get all quiz questions', async () => {
    // TODO
  });

  it('Should update a question', async () => {
    const updateQuestionInput =
      generateUpdateQuestionData(question).updateQuestionInput;

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: UPDATE_QUESTION_OPERATION_NAME,
        query: UPDATE_QUESTION_MUTATION,
        variables: { updateQuestionInput },
      })
      .expect(200)
      .expect(res => {
        const updatedQuestion: Question = res.body.data.updateQuestion;
        expect(updatedQuestion).toBeDefined();
        expect(updatedQuestion).toMatchObject(updateQuestionInput);
      });
  });

  it('Should delete a question', async () => {
    await request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: REMOVE_QUESTION_OPERATION_NAME,
        query: REMOVE_QUESTION_MUTATION,
        variables: { quizId: quiz.quizId, questionId: question.questionId },
      })
      .expect(200)
      .expect(res => {
        const deletedQuestion: Question = res.body.data.removeQuestion;
        expect(deletedQuestion).toBeDefined();
      });

    const updatedQuiz = await findTestQuiz({
      app,
      access_token,
      creatorId: quiz.creatorId,
      quizId: quiz.quizId,
    });
    const deletedQuestion = updatedQuiz.questions.find(
      q => q.questionId === question.questionId,
    );
    expect(deletedQuestion).toBeUndefined();
  });
});
