import { Injectable } from '@nestjs/common';
import { CreateArticleGroupInput } from './dto/create-article-group.input';
import { UpdateArticleGroupInput } from './dto/update-article-group.input';

@Injectable()
export class ArticleGroupsService {
  create(createArticleGroupInput: CreateArticleGroupInput) {
    return 'This action adds a new articleGroup';
  }

  findAll() {
    return `This action returns all articleGroups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} articleGroup`;
  }

  update(id: number, updateArticleGroupInput: UpdateArticleGroupInput) {
    return `This action updates a #${id} articleGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleGroup`;
  }
}
