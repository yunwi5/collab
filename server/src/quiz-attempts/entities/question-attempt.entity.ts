import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import GraphQLLong from 'graphql-type-long';

@ObjectType()
export class QuestionAttempt {
  @Field(() => ID)
  questionId: string;

  @Field(() => [String])
  selectedOptions: string[];

  @Field()
  prompt: string;

  @Field(() => [String])
  options: string[];

  @Field(() => [String])
  correctOptions: string[];

  @Field(() => Int, { defaultValue: 1 })
  point: number;

  @Field(() => GraphQLLong)
  createdAt: number;
}
