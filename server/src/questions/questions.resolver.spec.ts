import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

describe('QuestionsResolver', () => {
  let resolver: QuestionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsResolver, QuestionsService],
    }).compile();

    resolver = module.get<QuestionsResolver>(QuestionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
