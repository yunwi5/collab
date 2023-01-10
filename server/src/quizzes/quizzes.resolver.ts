import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/users/decorator';
import { JwtUser } from 'src/auth/auth.types';
import { User } from 'src/users/entities';
import { UsersService } from 'src/users/users.service';
import { Question } from 'src/questions/entities';
import { QuestionsService } from 'src/questions/questions.service';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { CreateQuizVoteInput } from './dto/create-quiz-vote.input';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly questionsService: QuestionsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  @Mutation(() => Quiz)
  @UseGuards(JwtAuthGuard)
  createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.quizzesService.create(user.userId, createQuizInput);
  }

  @Query(() => [Quiz], { name: 'quizzes' })
  findAll() {
    return this.quizzesService.findAll();
  }

  @Query(() => [Quiz], { name: 'quizzesByCreator' })
  findAllByCreator(@Args('creatorId') creatorId: string) {
    return this.quizzesService.findAllByCreator(creatorId);
  }

  @Query(() => Quiz, { name: 'quiz' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('creatorId') creatorId: string,
    @Args('quizId') quizId: string,
  ) {
    const quiz = await this.quizzesService.findByCreatorAndQuizId(
      creatorId,
      quizId,
    );
    if (quiz == null) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  @Mutation(() => Quiz)
  @UseGuards(JwtAuthGuard)
  updateQuiz(
    @CurrentUser() user: JwtUser,
    @Args('updateQuizInput') updateQuizInput: UpdateQuizInput,
  ) {
    return this.quizzesService.update(user.userId, updateQuizInput);
  }

  @Mutation(() => Quiz)
  @UseGuards(JwtAuthGuard)
  removeQuiz(@CurrentUser() user: JwtUser, @Args('quizId') quizId: string) {
    return this.quizzesService.remove(user.userId, quizId);
  }

  @Mutation(() => Quiz)
  @UseGuards(JwtAuthGuard)
  voteQuiz(
    @CurrentUser() user: JwtUser,
    @Args('createVoteInput') createVoteInput: CreateQuizVoteInput,
  ) {
    return this.quizzesService.voteQuiz(user.userId, createVoteInput);
  }

  @ResolveField(() => User, { name: 'creator' })
  findCreator(@Parent() quiz: Quiz): Promise<User> {
    return this.usersService.findById(quiz.creatorId);
  }

  @ResolveField(() => [Question], { name: 'questions' })
  findQuestions(@Parent() quiz: Quiz): Promise<Question[]> {
    return this.questionsService.findAllByQuizId(quiz.quizId);
  }

  @ResolveField(() => [Comment], { name: 'comments' })
  findComments(@Parent() quiz: Quiz): Promise<Comment[]> {
    return this.commentsService.findAllByParentId(quiz.quizId);
  }
}
