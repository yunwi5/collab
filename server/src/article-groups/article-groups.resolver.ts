import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleGroupsService } from './article-groups.service';
import { ArticleGroup } from './entities/article-group.entity';
import { CreateArticleGroupInput } from './dto/create-article-group.input';
import { UpdateArticleGroupInput } from './dto/update-article-group.input';

@Resolver(() => ArticleGroup)
export class ArticleGroupsResolver {
  constructor(private readonly articleGroupsService: ArticleGroupsService) {}

  @Mutation(() => ArticleGroup)
  createArticleGroup(@Args('createArticleGroupInput') createArticleGroupInput: CreateArticleGroupInput) {
    return this.articleGroupsService.create(createArticleGroupInput);
  }

  @Query(() => [ArticleGroup], { name: 'articleGroups' })
  findAll() {
    return this.articleGroupsService.findAll();
  }

  @Query(() => ArticleGroup, { name: 'articleGroup' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.articleGroupsService.findOne(id);
  }

  @Mutation(() => ArticleGroup)
  updateArticleGroup(@Args('updateArticleGroupInput') updateArticleGroupInput: UpdateArticleGroupInput) {
    return this.articleGroupsService.update(updateArticleGroupInput.id, updateArticleGroupInput);
  }

  @Mutation(() => ArticleGroup)
  removeArticleGroup(@Args('id', { type: () => Int }) id: number) {
    return this.articleGroupsService.remove(id);
  }
}
