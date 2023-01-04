import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SsoUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  sub: string;

  @Field({ nullable: true })
  provider: string;

  @Field({ nullable: true })
  picture?: string;
}
