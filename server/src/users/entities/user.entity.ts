import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLLong from 'graphql-type-long';
import { Item } from 'dynamoose/dist/Item';

@ObjectType()
export class User extends Item {
  @Field(() => String, { description: 'ID of the user' })
  userId: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLLong, { nullable: true })
  createdAt?: number;

  password: string;
}
