import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/users/decorator';
import { JwtUser } from 'src/auth/auth.types';
import { QuestionsService } from './questions.service';
import { Question } from './entities';
import { CreateQuestionInput, UpdateQuestionInput } from './dto';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @CurrentUser() user: JwtUser,
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionsService.create(user.userId, createQuestionInput);
  }

  @Query(() => [Question], { name: 'questionsByQuiz' })
  findAllByQuiz(@Args('quizId') quizId: string) {
    return this.questionsService.findAllByQuizId(quizId);
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @CurrentUser() user: JwtUser,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionsService.update(user.userId, updateQuestionInput);
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  removeQuestion(
    @CurrentUser() user: JwtUser,
    @Args('quizId') quizId: string,
    @Args('questionId') questionId: string,
  ) {
    return this.questionsService.remove(user.userId, quizId, questionId);
  }
}
