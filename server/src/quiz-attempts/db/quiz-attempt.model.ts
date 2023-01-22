import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { dbTableOptions } from 'src/config/db';
import { QuizAttempt } from '../entities/quiz-attempt.entity';

const questionAttemptSchema = new dynamoose.Schema({
  questionId: { type: String, required: true },
  selectedOptions: {
    type: Array,
    schema: [String],
  },
  prompt: String,
  options: {
    type: Array,
    schema: [String],
  },
  correctOptions: {
    type: Array,
    schema: [String],
  },
  point: Number,
  createdAt: Number,
});

export const quizAttemptSchema = new dynamoose.Schema({
  quizId: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    rangeKey: true,
    index: {
      name: dbTables.QuizAttemptUserIndex,
      rangeKey: 'timestamp',
    },
  },
  creatorId: String,
  timestamp: { type: Number, required: true },
  score: Number,
  scorePercentage: {
    type: Number,
    validate: value => value >= 0 && value <= 100,
  },
  pass: Boolean,
  answers: {
    type: Array,
    schema: [questionAttemptSchema],
  },
});

export const QuizAttemptModel = dynamoose.model<QuizAttempt>(
  dbTables.QuizAttemptTable,
  quizAttemptSchema,
  dbTableOptions,
);
