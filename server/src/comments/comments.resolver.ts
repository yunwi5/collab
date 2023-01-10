import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/users/decorator';
import { JwtUser } from 'src/auth/auth.types';
import { JwtAuthGuard } from 'src/auth/guards';
import { CommentsService } from './comments.service';
import { Comment } from './entities';
import { CreateCommentInput, UpdateCommentInput } from './dto';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @CurrentUser() user: JwtUser,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.create(user.userId, createCommentInput);
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(
    @Args('parentId') parentId: string,
    @Args('commentId') commentId: string,
  ) {
    return this.commentsService.findOne(parentId, commentId);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @CurrentUser() user: JwtUser,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.update(user.userId, updateCommentInput);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  removeComment(
    @CurrentUser() user: JwtUser,
    @Args('parentId') parentId: string,
    @Args('commentId') commentId: string,
  ) {
    return this.commentsService.remove(user.userId, parentId, commentId);
  }
}
