import { Test, TestingModule } from '@nestjs/testing';
import { ArticleGroupsService } from './article-groups.service';

describe('ArticleGroupsService', () => {
  let service: ArticleGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleGroupsService],
    }).compile();

    service = module.get<ArticleGroupsService>(ArticleGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
