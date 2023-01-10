import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'dynamoose/dist/Item';
import GraphQLLong from 'graphql-type-long';
import { Vote } from 'src/models';
import { User } from 'src/users/entities';

@ObjectType()
export class Comment extends Item {
  @Field(() => ID)
  parentId: string;

  @Field(() => ID)
  commentId: string;

  @Field(() => ID)
  userId: string; // not a part of primary key

  @Field()
  content: string; // either string or JSON

  @Field(() => GraphQLLong)
  createdAt: number;

  @Field(() => GraphQLLong)
  updatedAt: number;

  @Field(() => [Vote])
  votes: Vote[];

  @Field(() => User)
  user: User;

  @Field(() => [Comment])
  childComments: Comment[];
}
