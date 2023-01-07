import { Test, TestingModule } from '@nestjs/testing';
import { QuizAttemptsService } from './quiz-attempts.service';

describe('QuizAttemptsService', () => {
  let service: QuizAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizAttemptsService],
    }).compile();

    service = module.get<QuizAttemptsService>(QuizAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
