import { Module } from '@nestjs/common';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { QuizAttemptsService } from './quiz-attempts.service';
import { QuizAttemptsResolver } from './quiz-attempts.resolver';

@Module({
  imports: [QuizzesModule, QuestionsModule],
  providers: [QuizAttemptsResolver, QuizAttemptsService],
})
export class QuizAttemptsModule {}
