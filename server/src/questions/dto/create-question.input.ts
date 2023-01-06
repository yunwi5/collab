import { InputType, Field, ID } from '@nestjs/graphql';
import { CreateQuestionBaseInput } from './create-question-base.input';

@InputType()
export class CreateQuestionInput extends CreateQuestionBaseInput {
  @Field(() => ID)
  quizId: string;
}
