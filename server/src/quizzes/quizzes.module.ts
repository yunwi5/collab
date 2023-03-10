import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { CommentsModule } from 'src/comments/comments.module';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';

@Module({
  imports: [UsersModule, CommentsModule, QuestionsModule],
  providers: [QuizzesResolver, QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
