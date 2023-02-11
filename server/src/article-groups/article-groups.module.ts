import { Module } from '@nestjs/common';
import { ArticleGroupsService } from './article-groups.service';
import { ArticleGroupsResolver } from './article-groups.resolver';

@Module({
  providers: [ArticleGroupsResolver, ArticleGroupsService]
})
export class ArticleGroupsModule {}
