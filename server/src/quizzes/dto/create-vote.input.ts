import { Field, ID, InputType } from '@nestjs/graphql';
import { VoteType } from 'src/models';

@InputType()
export class CreateVoteInput {
  @Field(() => ID)
  creatorId: string;

  @Field(() => ID)
  quizId: string;

  @Field(() => VoteType)
  type: VoteType;
}
