import { ObjectType, Field } from '@nestjs/graphql';
import { Item } from 'dynamoose/dist/Item';
import GraphQLLong from 'graphql-type-long';

@ObjectType()
export class ArticleGroup extends Item {
  @Field(() => String)
  groupId: string;

  @Field(() => String)
  creatorId: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  icon?: string; // icon name

  @Field(() => GraphQLLong)
  createdAt: number;

  @Field(() => GraphQLLong)
  updatedAt: number;
}
