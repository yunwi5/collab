import * as dynamoose from 'dynamoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Vote {
  @Field(() => ID, { description: 'ID of the user' })
  userId: string;

  @Field({ description: 'Vote type' })
  type: 'up' | 'down';
}

export const voteSchema = new dynamoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['up', 'down'],
  },
});
