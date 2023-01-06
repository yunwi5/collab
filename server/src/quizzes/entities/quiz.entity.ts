import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import GraphQLLong from 'graphql-type-long';
import { Item } from 'dynamoose/dist/Item';
import { User } from 'src/users/entities';
import { Vote } from 'src/models';
import { Question } from 'src/questions/entities';

@ObjectType()
export class Quiz extends Item {
  @Field(() => ID, { description: 'ID of the quiz' })
  quizId: string;

  @Field(() => ID)
  creatorId: string;

  @Field()
  name: string;

  @Field()
  topic: string;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field(() => GraphQLLong)
  createdAt: number;

  @Field(() => GraphQLLong)
  updatedAt: number;

  @Field()
  level: string;

  @Field(() => Int)
  passScore: number;

  @Field(() => [Vote])
  votes: Vote[];

  @Field(() => User)
  creator: User; // resolve field

  @Field(() => [Question])
  questions: Question[]; // resolve field
}
