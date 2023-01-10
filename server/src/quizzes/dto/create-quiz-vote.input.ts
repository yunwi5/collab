import { Field, ID, InputType } from '@nestjs/graphql';
import { VoteType } from 'src/models';

@InputType()
export class CreateQuizVoteInput {
  @Field(() => ID)
  creatorId: string;

  @Field(() => ID)
  quizId: string;

  @Field(() => VoteType)
  type: VoteType;
}
