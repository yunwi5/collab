import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}

const appName = process.env.APP_NAME || 'Collab';
const userTable = `${appName}-${process.env.USER_TABLE}`;
const userTableNameIndex = process.env.USER_NAME_INDEX;

const quizTable = `${appName}-${process.env.QUIZ_TABLE}`;
const questionTable = `${appName}-${process.env.QUESTION_TABLE}`;

const quizAttemptTable = `${appName}-${process.env.ATTEMPT_HISTORY_TABLE}`;
const quizAttemptUserIndex = process.env.ATTEMPT_HISTORY_USER_INDEX;
const commentTable = `${appName}-${process.env.COMMENT_TABLE}`;

const articleGroupTable = `${appName}-${process.env.ARTICLE_GROUP_TABLE}`;
const articleGroupCreatorIndex = process.env.ARTICLE_GROUP_CREATOR_INDEX;

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
  ImageBucketName: process.env.IMAGE_S3_BUCKET,
});

export const dbTables = Object.freeze({
  UserTable: userTable,
  UserTableNameIndex: userTableNameIndex,
  QuizTable: quizTable,
  QuestionTable: questionTable,
  QuizAttemptTable: quizAttemptTable,
  QuizAttemptUserIndex: quizAttemptUserIndex,
  CommentTable: commentTable,
  ArticleGroupTable: articleGroupTable,
  ArticleGroupCreatorIndex: articleGroupCreatorIndex,
});
