import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { dbTableOptions } from 'src/config/db';
import { Question } from '../entities';

export const questionSchema = new dynamoose.Schema(
  {
    quizId: {
      type: String,
      hashKey: true,
    },
    questionId: {
      type: String,
      rangeKey: true,
    },
    prompt: {
      type: String, // will be JSON
      required: true,
    },
    options: {
      type: Array,
      schema: [String],
      default: [],
    },
    correctOptions: {
      type: Array,
      schema: [String],
      required: true,
      validate: value => Array.isArray(value) && value.length >= 1,
    },
    point: {
      type: Number,
      default: 1,
    },
    timeLimit: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  },
);

export const QuestionModel = dynamoose.model<Question>(
  dbTables.QuestionTable,
  questionSchema,
  dbTableOptions,
);
