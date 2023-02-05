import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { createRandomQuiz, findQuiz } from 'test/quizzes/quiz.e2e.util';
import { Question } from 'src/questions/entities';
import { E2eTestUtil } from 'test/e2e-test.util';
import { find, random } from 'lodash';
import {
  CREATE_QUESTIONS_MUTATION,
  CREATE_QUESTIONS_OPERATION_NAME,
  CREATE_QUESTION_MUTATION,
  CREATE_QUESTION_OPERATION_NAME,
  FIND_QUESTIONS_BY_QUIZ_OPERATION_NAME,
  FIND_QUESTIONS_BY_QUIZ_QUERY,
  REMOVE_QUESTION_MUTATION,
  REMOVE_QUESTION_OPERATION_NAME,
  UPDATE_QUESTION_MUTATION,
  UPDATE_QUESTION_OPERATION_NAME,
  generateCreateQuestionData,
  generateCreateQuestionListData,
  generateUpdateQuestionData,
} from './question.helper';

describe('Quiz resolver (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let quiz: Quiz;
  let question: Question;

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);

    const authResponse = await signUpAndIn(app);
    access_token = authResponse.access_token;

    quiz = await createRandomQuiz(app, access_token);
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  it('Should create a question', async () => {
    const { createQuestionInput } = generateCreateQuestionData(quiz.quizId);

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
    const { createQuestionInputs } = generateCreateQuestionListData(
      quiz.quizId,
      random(1, 5),
    );

    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: CREATE_QUESTIONS_OPERATION_NAME,
        query: CREATE_QUESTIONS_MUTATION,
        variables: { createQuestionInputs },
      })
      .expect(200)
      .expect(res => {
        const questions: Question[] = res.body.data.createQuestions;
        createQuestionInputs.forEach(questionInput => {
          const createdQuestion = find(questions, [
            'prompt',
            questionInput.prompt,
          ]);
          expect(createdQuestion).toBeDefined();
          expect(createdQuestion).toMatchObject(questionInput);
        });
      });
  });

  it('Should get all quiz questions', async () => {
    return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .auth(access_token, { type: 'bearer' })
      .send({
        operationName: FIND_QUESTIONS_BY_QUIZ_OPERATION_NAME,
        query: FIND_QUESTIONS_BY_QUIZ_QUERY,
        variables: { quizId: quiz.quizId },
      })
      .expect(200)
      .expect(res => {
        const quizQuestions: Question[] = res.body.data.questionsByQuiz;
        expect(Array.isArray(quizQuestions)).toBe(true);
        expect(quizQuestions.length).toBeGreaterThanOrEqual(1);
        expect(
          find(quizQuestions, ['questionId', question.questionId]),
        ).toBeDefined();
      });
  });

  it('Should update a question', async () => {
    const { updateQuestionInput } = generateUpdateQuestionData(question);

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

    const updatedQuiz = await findQuiz({
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
