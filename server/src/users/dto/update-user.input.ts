import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  userId: string;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  description?: string;
}
