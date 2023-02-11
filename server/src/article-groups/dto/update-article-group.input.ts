import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateArticleGroupInput } from './create-article-group.input';

@InputType()
export class UpdateArticleGroupInput extends PartialType(
  CreateArticleGroupInput,
) {
  @Field(() => String)
  groupId: string;
}
