import { InputType, Field, ID } from '@nestjs/graphql';
import { ArrayMinSize, IsUUID } from 'class-validator';
import { QuestionAttemptInput } from './question-attempt.input';

@InputType()
export class QuizAttemptInput {
  @Field(() => ID)
  @IsUUID()
  creatorId: string;

  @Field(() => ID)
  @IsUUID()
  quizId: string;

  @Field(() => [QuestionAttemptInput])
  @ArrayMinSize(1)
  answers: QuestionAttemptInput[];
}
