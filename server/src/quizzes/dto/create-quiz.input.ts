import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Length, Max, Min } from 'class-validator';

@InputType()
export class CreateQuizInput {
  @Field()
  @Length(5, 30)
  name: string;

  @Field()
  topic: string;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field()
  level: string;

  @Field(() => Int, { defaultValue: 70 })
  @IsInt()
  @Min(50)
  @Max(100)
  passScore: number;
}
