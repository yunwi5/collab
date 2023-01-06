import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLLong from 'graphql-type-long';
import { Item } from 'dynamoose/dist/Item';

@ObjectType()
export class Question extends Item {
  @Field(() => ID)
  quizId: string;

  @Field(() => ID)
  questionId: string;

  @Field()
  prompt: string;

  @Field(() => [String])
  options: string[];

  @Field(() => [String])
  correctOptions: string[];

  @Field(() => GraphQLLong)
  createdAt: number;

  @Field(() => GraphQLLong)
  updatedAt: number;
}
