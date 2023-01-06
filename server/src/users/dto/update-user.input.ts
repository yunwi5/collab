import { InputType, Field } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsUUID()
  userId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username: string;

  @Field({ nullable: true })
  @IsString()
  @Length(3, 30)
  displayName?: string;

  @Field({ nullable: true })
  @IsString()
  @Length(5, 1000)
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @MinLength(10)
  picture?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;
}
