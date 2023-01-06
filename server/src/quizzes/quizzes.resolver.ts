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
import { QuizzesService } from './quizzes.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { CreateVoteInput } from './dto/create-vote.input';

@Resolver(() => Quiz)
export class QuizzesResolver {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly usersService: UsersService,
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

  @ResolveField(() => User, { name: 'creator' })
  findCreator(@Parent() quiz: Quiz): Promise<User> {
    return this.usersService.findById(quiz.creatorId);
  }

  @Mutation(() => Quiz)
  @UseGuards(JwtAuthGuard)
  voteQuiz(
    @CurrentUser() user: JwtUser,
    @Args('createVoteInput') createVoteInput: CreateVoteInput,
  ) {
    return this.quizzesService.voteQuiz(user.userId, createVoteInput);
  }
}
