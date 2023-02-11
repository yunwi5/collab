import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreateArticleGroupInput {
  @Field(() => String)
  creatorId: string;

  @Field(() => String)
  @Length(3, 25)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  icon?: string; // icon name
}
