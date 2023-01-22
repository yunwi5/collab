import * as dynamoose from 'dynamoose';
import { QuizModel } from 'src/quizzes/db/quiz.model';
import { UserModel } from 'src/users/db/user.model';
import { QuestionModel } from 'src/questions/db/question.model';
import { CommentModel } from 'src/comments/db/comment.model';
import { QuizAttemptModel } from 'src/quiz-attempts/db/quiz-attempt.model';
import { dbTables, envConfig } from './env.config';

export const createTables = () => {
  const QuizTable = new dynamoose.Table(dbTables.QuizTable, [QuizModel]);
  console.log(QuizTable.name);

  const UserTable = new dynamoose.Table(dbTables.UserTable, [UserModel]);
  console.log(UserTable.name);

  const QuestionTable = new dynamoose.Table(dbTables.QuestionTable, [
    QuestionModel,
  ]);
  console.log(QuestionTable.name);

  const QuizAttemptTable = new dynamoose.Table(dbTables.QuizAttemptTable, [
    QuizAttemptModel,
  ]);
  console.log(QuizAttemptTable.name);

  const CommentTable = new dynamoose.Table(dbTables.CommentTable, [
    CommentModel,
  ]);
  console.log(CommentTable.name);
};

export const configureDynamoDB = () => {
  if (envConfig.Testing) {
    dynamoose.aws.ddb.local('http://localhost:8000');
  } else {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: envConfig.AwsRegion,
      accessKeyId: envConfig.AwsAccessKeyId,
      secretAccessKey: envConfig.AwsAccessSecret,
    } as any);

    dynamoose.aws.ddb.set(ddb);
  }

  createTables();
};

export const dbTableOptions = {
  create: !!envConfig.Testing,
  waitForActive: !!envConfig.Testing,
};
