import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  userId: string;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  description?: string;
}
