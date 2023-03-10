import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { JwtUser } from 'src/auth/auth.types';
import { CurrentUser } from 'src/users/decorator';
import { ArticleGroupsService } from './article-groups.service';
import { ArticleGroup } from './entities/article-group.entity';
import { CreateArticleGroupInput } from './dto/create-article-group.input';
import { UpdateArticleGroupInput } from './dto/update-article-group.input';

@Resolver(() => ArticleGroup)
export class ArticleGroupsResolver {
  constructor(private readonly articleGroupsService: ArticleGroupsService) {}

  @Mutation(() => ArticleGroup)
  @UseGuards(JwtAuthGuard)
  createArticleGroup(
    @CurrentUser() user: JwtUser,
    @Args('createArticleGroupInput')
    createArticleGroupInput: CreateArticleGroupInput,
  ) {
    return this.articleGroupsService.create(
      user.userId,
      createArticleGroupInput,
    );
  }

  @Query(() => [ArticleGroup], { name: 'articleGroupsByCreator' })
  findAllByCreator(@Args('creatorId') creatorId: string) {
    return this.articleGroupsService.findAllByCreatorId(creatorId);
  }

  @Query(() => [ArticleGroup], { name: 'articleGroupsByParent' })
  fildAllByParent(@Args('parentId') parentId: string) {
    return this.articleGroupsService.findAllByParentId(parentId);
  }

  @Query(() => ArticleGroup, { name: 'articleGroup' })
  findOne(@Args('groupId') groupId: string) {
    return this.articleGroupsService.findById(groupId);
  }

  @Mutation(() => ArticleGroup)
  @UseGuards(JwtAuthGuard)
  updateArticleGroup(
    @CurrentUser() user: JwtUser,
    @Args('updateArticleGroupInput')
    updateArticleGroupInput: UpdateArticleGroupInput,
  ) {
    return this.articleGroupsService.update(
      user.userId,
      updateArticleGroupInput,
    );
  }

  @Mutation(() => ArticleGroup)
  @UseGuards(JwtAuthGuard)
  removeArticleGroup(
    @CurrentUser() user: JwtUser,
    @Args('groupId') groupId: string,
  ) {
    return this.articleGroupsService.remove(user.userId, groupId);
  }

  @ResolveField(() => [ArticleGroup], { name: 'childGroups' })
  findChildGroups(@Parent() articleGroup: ArticleGroup) {
    return this.articleGroupsService.findAllByParentId(articleGroup.groupId);
  }
}
