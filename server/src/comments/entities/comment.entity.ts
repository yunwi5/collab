import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'dynamoose/dist/Item';
import GraphQLLong from 'graphql-type-long';
import { Vote } from 'src/models';

@ObjectType()
export class Comment extends Item {
  @Field(() => ID)
  parentId: string;

  @Field(() => ID)
  commentId: string;

  @Field()
  content: string; // either string or JSON

  @Field(() => GraphQLLong)
  createdAt: number;

  @Field(() => GraphQLLong)
  updatedAt: number;

  @Field(() => [Vote])
  votes: Vote[];
}
