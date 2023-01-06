import { InputType, Field, Int } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsInt, Min, MinLength } from 'class-validator';

@InputType()
export class CreateQuestionBaseInput {
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

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  point: number;

  @Field(() => Int, { defaultValue: 60 })
  @IsInt()
  @Min(5)
  timeLimit: number; // in seconds
}
