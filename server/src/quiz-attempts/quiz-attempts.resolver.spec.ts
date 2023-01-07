import { Test, TestingModule } from '@nestjs/testing';
import { QuizAttemptsResolver } from './quiz-attempts.resolver';
import { QuizAttemptsService } from './quiz-attempts.service';

describe('QuizAttemptsResolver', () => {
  let resolver: QuizAttemptsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizAttemptsResolver, QuizAttemptsService],
    }).compile();

    resolver = module.get<QuizAttemptsResolver>(QuizAttemptsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
