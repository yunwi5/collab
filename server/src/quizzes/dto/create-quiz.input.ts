import { InputType, Field, Float } from '@nestjs/graphql';
import { IsInt, Length, Max, Min } from 'class-validator';
import { LevelType } from 'src/models/level/Level.enum';
import { CreateQuestionBaseInput } from 'src/questions/dto';

@InputType()
export class CreateQuizInput {
  @Field()
  @Length(5, 30)
  name: string;

  @Field()
  topic: string;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field(() => LevelType)
  level: LevelType;

  @Field(() => Float, { defaultValue: 70 })
  @IsInt()
  @Min(50)
  @Max(100)
  passScore: number; // between 50% and 100%

  @Field(() => [CreateQuestionBaseInput], { nullable: true })
  questions?: CreateQuestionBaseInput[];
}
