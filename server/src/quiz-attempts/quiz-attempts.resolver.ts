import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from 'src/users/decorator';
import { JwtUser } from 'src/auth/auth.types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { QuizAttemptsService } from './quiz-attempts.service';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { QuizAttemptInput } from './dto/quiz-attempt.input';

@Resolver(() => QuizAttempt)
export class QuizAttemptsResolver {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Mutation(() => QuizAttempt)
  @UseGuards(JwtAuthGuard)
  submitQuizAttempt(
    @CurrentUser() user: JwtUser,
    @Args('quizAttemptInput')
    quizAttemptInput: QuizAttemptInput,
  ) {
    return this.quizAttemptsService.create(quizAttemptInput, user.userId);
  }

  @Query(() => [QuizAttempt], { name: 'quizAttemptsByQuiz' })
  findAllByQuiz(@Args('quizId') quizId: string) {
    return this.quizAttemptsService.findAllByQuizId(quizId);
  }

  @Query(() => [QuizAttempt], { name: 'quizAttemptsByUser' })
  findAllByUser(@Args('userId') userId: string) {
    return this.quizAttemptsService.findAllByUserId(userId);
  }

  @Query(() => QuizAttempt, { name: 'quizAttempt' })
  findByQuizAndUserId(
    @Args('quizId') quizId: string,
    @Args('userId') userId: string,
  ) {
    return this.quizAttemptsService.findByQuizAndUserId(quizId, userId);
  }
}
