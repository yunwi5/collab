import { Field, ID, InputType } from '@nestjs/graphql';
import { VoteType } from 'src/models';

@InputType()
export class CreateCommentVoteInput {
  @Field(() => ID)
  parentId: string;

  @Field(() => ID)
  commentId: string;

  @Field(() => VoteType)
  type: VoteType;
}
