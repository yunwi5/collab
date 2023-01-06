import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { QuestionsService } from './questions.service';
import { Question } from './entities';
import { CreateQuestionInput, UpdateQuestionInput } from './dto';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionsService.create(createQuestionInput);
  }

  @Query(() => [Question], { name: 'questionsByQuiz' })
  findAllByQuiz(@Args('quizId') quizId: string) {
    return this.questionsService.findAllByQuizId(quizId);
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionsService.update(updateQuestionInput);
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthGuard)
  removeQuestion(
    @Args('quizId') quizId: string,
    @Args('questionId') questionId: string,
  ) {
    return this.questionsService.remove(quizId, questionId);
  }
}
