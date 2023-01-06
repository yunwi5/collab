import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';

@Module({
  imports: [UsersModule],
  providers: [QuizzesResolver, QuizzesService],
})
export class QuizzesModule {}
