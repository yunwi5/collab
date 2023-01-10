import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, Length } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  parentId: string;

  @Field()
  @Length(5, 1000)
  content: string;
}
