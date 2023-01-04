import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const appName = process.env.APP_NAME || 'Collab';
const userTable = `${appName}-${process.env.USER_TABLE}`;
const userTableNameIndex = process.env.USER_TABLE_NAME_INDEX;

export const envConfig = Object.freeze({
  AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AwsAccessSecret: process.env.AWS_SECRET_ACCESS_KEY,
  AwsRegion: process.env.AWS_REGION,
  JwtSecret: process.env.JWT_SECRET || 'thisshouldbeasecret',
  AppName: appName,
});

export const dbTables = Object.freeze({
  UserTable: userTable,
  UserTableNameIndex: userTableNameIndex,
});
