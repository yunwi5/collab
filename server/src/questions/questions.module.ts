import { Module, forwardRef } from '@nestjs/common';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';

@Module({
  imports: [forwardRef(() => QuizzesModule)],
  providers: [QuestionsResolver, QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
