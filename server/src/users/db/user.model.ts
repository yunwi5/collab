import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env-config';
import { AuthProviderList } from 'src/auth-sso/auth-sso.enum';
import { validateEmail } from 'src/utils/string.util';
import { User } from '../entities/user.entity';

export const userSchema = new dynamoose.Schema(
  {
    userId: { type: String, required: true, hashKey: true },
    username: {
      type: String,
      required: true,
      index: {
        name: dbTables.UserTableNameIndex,
      },
    },
    email: {
      type: String,
      validate: (value) => validateEmail(value.toString()),
      required: true,
    },
    description: {
      type: String,
      validate: (value) => value.toString().length > 3,
    },
    password: {
      type: String,
      validate: (value) => value.toString().length > 6,
    },
    picture: String,
    provider: { type: String, enum: AuthProviderList },
    sub: String,
  },
  {
    timestamps: true,
  },
);

export const UserModel = dynamoose.model<User>(dbTables.UserTable, userSchema);
