import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { voteSchema } from 'src/models';
import { dbTableOptions } from 'src/config/db';
import { Comment } from '../entities';

export const commentSchema = new dynamoose.Schema(
  {
    parentId: {
      type: String,
      hashKey: true,
    },
    commentId: {
      type: String,
      rangeKey: true,
    },
    userId: {
      type: String,
      required: true,
    },
    replyTo: String,
    content: {
      type: String,
      required: true,
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

export const CommentModel = dynamoose.model<Comment>(
  dbTables.CommentTable,
  commentSchema,
  dbTableOptions,
);
