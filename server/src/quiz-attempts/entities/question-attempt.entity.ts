import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QuestionAttempt {
  @Field(() => ID)
  questionId: string;

  @Field(() => [String])
  selectedOptions: string[];
}
