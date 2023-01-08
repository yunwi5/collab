import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { isProduction } from './utils';
import { configureDynamoDB } from './config/db';
import { AuthSsoModule } from './auth-sso/auth-sso.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { QuizAttemptsModule } from './quiz-attempts/quiz-attempts.module';
import { S3Module } from './aws/s3/s3.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isProduction()
        ? join('/tmp', '/schema.gql')
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    AuthModule,
    AuthSsoModule,
    UsersModule,
    QuizzesModule,
    QuestionsModule,
    QuizAttemptsModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    configureDynamoDB();
  }
}
