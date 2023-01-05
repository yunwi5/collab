import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @MinLength(3, { message: 'Username should be at least 3 characters!' })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters!' })
  password: string;
}
