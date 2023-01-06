import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const appName = process.env.APP_NAME || 'Collab';
const userTable = `${appName}-${process.env.USER_TABLE}`;
const userTableNameIndex = process.env.USER_TABLE_NAME_INDEX;

const quizTable = `${appName}-${process.env.QUIZ_TABLE}`;
const questionTable = `${appName}-${process.env.QUESTION_TABLE}`;

export const envConfig = Object.freeze({
  AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AwsAccessSecret: process.env.AWS_SECRET_ACCESS_KEY,
  AwsRegion: process.env.AWS_REGION,
  GoogleClientId: process.env.GOOGLE_CLIENT_ID,
  GoogleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  GoogleAuthCallback: process.env.GOOGLE_AUTH_CALLBACK,

  GithubClientId: process.env.GITHUB_CLIENT_ID,
  GithubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  GithubAuthCallback: process.env.GITHUB_AUTH_CALLBACK,
  JwtSecret: process.env.JWT_SECRET || 'thisshouldbeasecret',
  AppName: appName,
  Testing: process.env.TESTING === 'true',
});

export const dbTables = Object.freeze({
  UserTable: userTable,
  UserTableNameIndex: userTableNameIndex,
  QuizTable: quizTable,
  QuestionTable: questionTable,
});

console.log(dbTables);
