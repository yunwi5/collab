import * as dynamoose from 'dynamoose';

import { dbTables } from 'src/config/env.config';
import { dbTableOptions } from 'src/config/db';
import { ArticleGroup } from '../entities';

export const articleGroupSchema = new dynamoose.Schema(
  {
    groupId: {
      type: String,
      hashKey: true,
    },
    creatorId: {
      type: String,
      required: true,
      index: {
        name: dbTables.ArticleGroupCreatorIndex,
        rangeKey: 'groupId',
      },
    },
    parentId: {
      type: String,
      index: {
        name: dbTables.ArticleGroupParentIndex,
        rangeKey: 'groupId',
      },
    },
    name: {
      type: String,
      validate: value => value.toString().length >= 3,
      required: true,
    },
    icon: String,
  },
  {
    timestamps: true,
  },
);

export const ArticleGroupModel = dynamoose.model<ArticleGroup>(
  dbTables.ArticleGroupTable,
  articleGroupSchema,
  dbTableOptions,
);
