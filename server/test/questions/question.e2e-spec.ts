import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { User } from 'src/users/entities';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { createTestQuiz } from 'test/quizzes/quiz.e2e.util';
import { CREATE_QUESTION_MUTATION, CREATE_QUESTION_OPERATION_NAME, generateCreateQuestionData } from './question.helper';
import { Question } from 'src/questions/entities';

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

    quiz = await createTestQuiz(app, access_token);
  });


  it('Should create a question', async () => {
    const createQuestionInput = generateCreateQuestionData(quiz.quizId).createQuestionInput;

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
        console.log(res);
        const question: Question = res.body.data.createQuestion;
        expect(question).toBeDefined();
        expect(question.prompt).toEqual(createQuestionInput.prompt);
      });
  })

  it('Should batch create question', async () => {
    // TODO
  })

  it('Should get all quiz questions', async () => {
    // TODO
  })

  it('Should update a question', async () => {
    // TODO
  })

  it('Should delete a question', async () => {
    // TODO
  })
});
