import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class QuestionAttemptInput {
  @Field(() => ID)
  questionId: string;

  @Field(() => [String])
  selectedOptions: string[];
}
