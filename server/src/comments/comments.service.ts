import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { getErrorMessage, isValidationError } from 'src/utils/error.util';
import { CreateCommentInput, UpdateCommentInput } from './dto';
import { CommentModel } from './db/comment.model';
import { Comment } from './entities';

@Injectable()
export class CommentsService {
  async create(
    userId: string,
    createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    try {
      const comment = await CommentModel.create({
        ...createCommentInput,
        commentId: crypto.randomUUID(),
        userId,
      });
      return comment;
    } catch (err) {
      const message = getErrorMessage(err);
      console.log('message:', message);
      if (isValidationError(err)) {
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(message);
    }
  }

  async findAllByParentId(parentId: string): Promise<Comment[]> {
    try {
      return await CommentModel.query({ parentId }).exec();
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  findOne(parentId: string, commentId: string): Promise<Comment> {
    return CommentModel.get({ parentId, commentId });
  }

  async findOneAndValidate(
    userId: string,
    parentId: string,
    commentId: string,
  ): Promise<Comment> {
    const existingComment = await this.findOne(parentId, commentId);

    if (existingComment == null) {
      throw new NotFoundException('Comment not found');
    } else if (existingComment.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }

    return existingComment;
  }

  async update(
    userId: string,
    updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    const { parentId, commentId, ...updateCommentProps } = updateCommentInput;

    await this.findOneAndValidate(userId, parentId, commentId);

    try {
      const updatedComment = await CommentModel.update(
        { parentId, commentId },
        updateCommentProps,
      );
      return updatedComment;
    } catch (err) {
      const message = getErrorMessage(err);
      if (isValidationError(err)) {
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(message);
    }
  }

  async remove(userId: string, parentId: string, commentId: string) {
    const existingComment = await this.findOneAndValidate(
      userId,
      parentId,
      commentId,
    );
    await existingComment.delete();

    return existingComment;
  }
}
