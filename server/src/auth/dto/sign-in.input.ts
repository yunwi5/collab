import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters!' })
  password: string;
}
