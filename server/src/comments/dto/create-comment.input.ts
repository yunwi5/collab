import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  parentId: string;

  @Field()
  @Length(5, 1000)
  content: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  replyTo?: string; // comment ID that this comment directly replies to
}
