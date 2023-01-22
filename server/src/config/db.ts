import * as dynamoose from 'dynamoose';
import * as AWS from 'aws-sdk';
import { QuizModel } from 'src/quizzes/db/quiz.model';
import { UserModel } from 'src/users/db/user.model';
import { QuestionModel } from 'src/questions/db/question.model';
import { CommentModel } from 'src/comments/db/comment.model';
import { QuizAttemptModel } from 'src/quiz-attempts/db/quiz-attempt.model';
import { dbTables, envConfig } from './env.config';

const createTables = (existingTables: Set<string>) => {
  if (!existingTables.has(dbTables.QuizTable)) {
    const QuizTable = new dynamoose.Table(dbTables.QuizTable, [QuizModel]);
    console.log(QuizTable.name);
  }

  if (!existingTables.has(dbTables.UserTable)) {
    const UserTable = new dynamoose.Table(dbTables.UserTable, [UserModel]);
    console.log(UserTable.name);
  }

  if (!existingTables.has(dbTables.QuestionTable)) {
    const QuestionTable = new dynamoose.Table(dbTables.QuestionTable, [
      QuestionModel,
    ]);
    console.log(QuestionTable.name);
  }

  if (!existingTables.has(dbTables.QuizAttemptTable)) {
    const QuizAttemptTable = new dynamoose.Table(dbTables.QuizAttemptTable, [
      QuizAttemptModel,
    ]);
    console.log(QuizAttemptTable.name);
  }

  if (!existingTables.has(dbTables.CommentTable)) {
    const CommentTable = new dynamoose.Table(dbTables.CommentTable, [
      CommentModel,
    ]);
    console.log(CommentTable.name);
  }
};

export const removeTables = () => {
  const dynamodb = new AWS.DynamoDB({ endpoint: 'http://localhost:8000' });

  dynamodb.deleteTable({ TableName: dbTables.QuizTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.QuestionTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.UserTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.QuizAttemptTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.CommentTable }).send();
};

export const checkAndCreateTables = async () => {
  const dynamodb = new AWS.DynamoDB({ endpoint: 'http://localhost:8000' });

  dynamodb.listTables({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data.TableNames);
      const tables = new Set(data.TableNames);

      createTables(tables);
    }
  });
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
};

export const dbTableOptions = {
  create: !!envConfig.Testing,
  waitForActive: !!envConfig.Testing,
};
