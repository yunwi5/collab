import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { voteSchema } from 'src/models';
import { dbTableOptions } from 'src/config/db';
import { LevelTypeList } from 'src/models/level/Level.enum';
import { ArticleGroup } from '../entities';

export const articleGroupSchema = new dynamoose.Schema(
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
      enum: LevelTypeList,
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

export const QuizModel = dynamoose.model<ArticleGroup>(
  dbTables.QuizTable,
  articleGroupSchema,
  dbTableOptions,
);
