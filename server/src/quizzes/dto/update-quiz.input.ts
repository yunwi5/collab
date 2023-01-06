import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateQuizInput } from './create-quiz.input';

@InputType()
export class UpdateQuizInput extends PartialType(CreateQuizInput) {
  @Field(() => String)
  quizId: string;
}
