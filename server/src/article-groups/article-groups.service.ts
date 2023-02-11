import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { getLogger } from 'src/config/logger.config';
import crypto from 'crypto';
import { getErrorMessage, isValidationError } from 'src/utils/error.util';
import { dbTables } from 'src/config/env.config';
import { CreateArticleGroupInput } from './dto/create-article-group.input';
import { UpdateArticleGroupInput } from './dto/update-article-group.input';
import { ArticleGroupModel } from './db/article-group.model';
import { ArticleGroup } from './entities';

@Injectable()
export class ArticleGroupsService {
  private readonly logger = getLogger(ArticleGroupsService.name);

  async create(createArticleGroupInput: CreateArticleGroupInput) {
    const articleGroupInput = {
      ...createArticleGroupInput,
      groupId: crypto.randomUUID(),
    };

    try {
      const articleGroup = await ArticleGroupModel.create(articleGroupInput);
      this.logger.info(
        'successfully create article group; article group: %s;',
        articleGroup,
      );

      return articleGroup;
    } catch (err) {
      this.logger.error(
        'failed to create article group; err: %s',
        getErrorMessage(err),
      );

      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Article group input is not acceptable');
      }

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAllByCreatorId(creatorId: string): Promise<ArticleGroup[]> {
    try {
      const userArticleGroups = await ArticleGroupModel.query('creatorId')
        .eq(creatorId)
        .using(dbTables.ArticleGroupCreatorIndex)
        .sort('ascending')
        .exec();

      this.logger.info(
        'successfully retrieved user articles; count: %s',
        userArticleGroups.length,
      );

      return userArticleGroups;
    } catch (err) {
      this.logger.error(
        'failed to get article group; err: %s',
        getErrorMessage(err),
      );

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findById(groupId: string): Promise<ArticleGroup> {
    try {
      const group = await ArticleGroupModel.get(groupId);
      this.logger.info('article group found; article group: %s', group);

      return group;
    } catch (err) {
      this.logger.error(
        'failed to get article group; err: %s',
        getErrorMessage(err),
      );

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async update(
    userId: string,
    updateArticleGroupInput: UpdateArticleGroupInput,
  ) {
    const { groupId, creatorId, ...updateProps } = updateArticleGroupInput;
    if (userId !== creatorId) {
      throw new UnauthorizedException(
        'Only the author of the group can update it',
      );
    }

    try {
      const updatedGroup = await ArticleGroupModel.update(
        { groupId },
        updateProps,
      );

      return updatedGroup;
    } catch (err) {
      this.logger.error(
        'failed to update article group; id: %s; input: %s; err: %s',
        groupId,
        updateProps,
        getErrorMessage(err),
      );

      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Article group input is not acceptable');
      }

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async remove(userId: string, groupId: string): Promise<ArticleGroup> {
    const articleGroup = await this.findById(groupId);

    if (articleGroup == null)
      throw new NotFoundException('Article group not found');

    if (articleGroup.creatorId !== userId)
      throw new UnauthorizedException(
        'Only the creator of the group can elete the group',
      );

    try {
      await ArticleGroupModel.delete(groupId);

      return articleGroup;
    } catch (err) {
      this.logger.error(
        'failed to delete the article group; id: %s; err: %s;',
        groupId,
        getErrorMessage(err),
      );

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }
}
