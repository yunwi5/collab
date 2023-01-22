import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { voteSchema } from 'src/models';
import { dbTableOptions } from 'src/config/db';
import { Quiz } from '../entities/quiz.entity';
import { LevelEnumList } from '../quizzes.enum';

export const quizSchema = new dynamoose.Schema(
  {
    creatorId: {
      type: String,
      hashKey: true,
    },
    quizId: {
      type: String,
      rangeKey: true,
    },
    topic: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    tags: {
      type: Array,
      schema: [String],
      default: [],
      validate: value =>
        Array.isArray(value) &&
        value.every(item => typeof item === 'string' && item.length > 1),
    },
    level: {
      type: String,
      enum: LevelEnumList,
    },
    passScore: {
      type: Number,
      default: 70,
    },
    votes: {
      type: Array,
      schema: [voteSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const QuizModel = dynamoose.model<Quiz>(
  dbTables.QuizTable,
  quizSchema,
  dbTableOptions,
);
