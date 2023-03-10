import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateCommentInput } from './create-comment.input';

@InputType()
export class UpdateCommentInput extends CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  commentId: string;
}
