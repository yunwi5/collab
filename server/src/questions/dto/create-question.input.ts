import { InputType, Field, ID } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, MinLength } from 'class-validator';

@InputType()
export class CreateQuestionInput {
  @Field(() => ID)
  quizId: string;

  @Field()
  @MinLength(5)
  prompt: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(2)
  options: string[];

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  correctOptions: string[];
}
