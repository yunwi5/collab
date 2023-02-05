import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { getErrorMessage, isValidationError } from 'src/utils/error.util';
import { Vote } from 'src/models';
import { getLogger } from 'src/config/logger.config';
import {
  CreateCommentInput,
  CreateCommentVoteInput,
  UpdateCommentInput,
} from './dto';
import { CommentModel } from './db/comment.model';
import { Comment } from './entities';

@Injectable()
export class CommentsService {
  private readonly logger = getLogger(CommentsService.name);

  async validateReplyTo(commentInput: CreateCommentInput): Promise<boolean> {
    if (!commentInput.replyTo) return true;

    const { parentId } = commentInput;
    const replyToParent = await this.findByParentAndCommentId(
      parentId,
      commentInput.replyTo,
    );

    return replyToParent != null;
  }

  async create(
    userId: string,
    createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    const replyToValid = await this.validateReplyTo(createCommentInput);
    if (!replyToValid)
      throw new BadRequestException(
        'Comment and reply-to comment should have the same parent',
      );

    try {
      const comment = await CommentModel.create({
        ...createCommentInput,
        commentId: crypto.randomUUID(),
        userId,
      });
      return comment;
    } catch (err) {
      const message = getErrorMessage(err);
      this.logger.error('could not create a comment; err: %s;', message);
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
      this.logger.error(
        'could not find comments by parent; parent ID: %s; err: %s;',
        parentId,
        getErrorMessage(err),
      );
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  findByParentAndCommentId(
    parentId: string,
    commentId: string,
  ): Promise<Comment> {
    return CommentModel.get({ parentId, commentId });
  }

  async findOneAndValidate(
    userId: string,
    parentId: string,
    commentId: string,
  ): Promise<Comment> {
    const existingComment = await this.findByParentAndCommentId(
      parentId,
      commentId,
    );

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
      this.logger.error(
        'could not update comment; update input: %s; err: %s;',
        updateCommentInput,
        message,
      );
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

    try {
      await existingComment.delete();
      return existingComment;
    } catch (err) {
      const message = getErrorMessage(err);
      this.logger.error('could not remove comment; err: %s;', message);
      throw new InternalServerErrorException(message);
    }
  }

  async voteComment(
    userId: string,
    createVoteInput: CreateCommentVoteInput,
  ): Promise<Comment> {
    const comment = await this.findByParentAndCommentId(
      createVoteInput.parentId,
      createVoteInput.commentId,
    );
    if (comment == null) {
      throw new NotFoundException('Comment not found');
    }

    const vote: Vote = {
      userId,
      type: createVoteInput.type,
    };

    const filteredVotes = comment.votes.filter(c => c.userId !== userId);
    comment.votes = [...filteredVotes, vote];

    await comment.save();

    return comment;
  }
}
