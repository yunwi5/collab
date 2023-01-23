import * as dynamoose from 'dynamoose';
import * as AWS from 'aws-sdk';
import { dbTables, envConfig } from './env.config';

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

export const removeTables = async () => {
  const dynamodb = new AWS.DynamoDB({ endpoint: 'http://localhost:8000' });

  dynamodb.deleteTable({ TableName: dbTables.QuizTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.QuestionTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.UserTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.QuizAttemptTable }).send();
  dynamodb.deleteTable({ TableName: dbTables.CommentTable }).send();
};

export const dbTableOptions = {
  create: !!envConfig.Testing,
  waitForActive: !!envConfig.Testing,
};
