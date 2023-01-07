import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import GraphQLLong from 'graphql-type-long';
import { Item } from 'dynamoose/dist/Item';

import { User } from 'src/users/entities';
import { QuestionAttempt } from './question-attempt.entity';

@ObjectType()
export class QuizAttempt extends Item {
  @Field(() => ID)
  quizId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  creatorId: string; // for finding the quiz by creator and quiz ID

  @Field(() => GraphQLLong)
  timestamp: number;

  @Field(() => Int)
  score: number;

  @Field(() => Float)
  scorePercentage: number;

  @Field(() => Boolean)
  pass: boolean;

  @Field(() => [QuestionAttempt])
  answers: QuestionAttempt[];

  @Field(() => User)
  user: User; // TODO: make resolve field
}
