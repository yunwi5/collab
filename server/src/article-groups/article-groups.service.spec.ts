import { Test, TestingModule } from '@nestjs/testing';
import Chance from 'chance';
import crypto from 'crypto';
import { find } from 'lodash';
import { ArticleGroupsService } from './article-groups.service';
import { CreateArticleGroupInput } from './dto/create-article-group.input';
import { ArticleGroup } from './entities';

const chance = new Chance();

describe('ArticleGroupsService', () => {
  let service: ArticleGroupsService;
  const userId1 = crypto.randomUUID();
  let articleGroup1: ArticleGroup;
  let articleGroup2: ArticleGroup;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleGroupsService],
    }).compile();

    service = module.get<ArticleGroupsService>(ArticleGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new article group', async () => {
      const groupInput1: CreateArticleGroupInput = {
        creatorId: userId1,
        name: chance.name(),
        icon: chance.name(),
      };
      const groupInput2: CreateArticleGroupInput = {
        creatorId: userId1,
        name: chance.name(),
        icon: chance.name(),
      };

      articleGroup1 = await service.create(groupInput1);
      expect(articleGroup1).toMatchObject(groupInput1);
      expect(articleGroup1.createdAt).toBeDefined();
      expect(articleGroup1.updatedAt).toBeDefined();

      articleGroup2 = await service.create(groupInput2);
      expect(articleGroup2).toMatchObject(groupInput2);
      expect(articleGroup2.createdAt).toBeDefined();
      expect(articleGroup2.updatedAt).toBeDefined();
    });

    it('should not create new group with too short name', async () => {
      const groupInput: CreateArticleGroupInput = {
        creatorId: userId1,
        name: 'a',
        icon: chance.name(),
      };

      try {
        await service.create(groupInput);
      } catch (err: any) {
        expect(err.response.statusCode).toEqual(400);
      }
    });
  });

  describe('findAllByCreatorId', () => {
    it('should find by creator', async () => {
      const groups = await service.findAllByCreatorId(userId1);

      expect(find(groups, ['groupId', articleGroup1.groupId])).toBeDefined();
      expect(find(groups, ['groupId', articleGroup2.groupId])).toBeDefined();
    });

    it('should find nothing for non-existing user', async () => {
      const groups = await service.findAllByCreatorId('non-existing-id');

      expect(groups).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should find by id', async () => {
      const retrievedGroup1 = await service.findById(articleGroup1.groupId);
      const retrievedGroup2 = await service.findById(articleGroup2.groupId);

      expect(retrievedGroup1.groupId).toEqual(articleGroup1.groupId);
      expect(retrievedGroup2.groupId).toEqual(articleGroup2.groupId);
    });

    it('should not find non-existing one', async () => {
      const found = await service.findById('non-existing-id');
      expect(found).toBeFalsy();
    });
  });

  describe('update', () => {
    it('should update quiz by id', async () => {
      const updateProps1 = {
        creatorId: articleGroup1.creatorId,
        groupId: articleGroup1.groupId,
        name: 'updated-quiz-1',
        icon: 'updated-icon',
      };
      const updatedQuiz = await service.update(userId1, updateProps1);
      expect(updatedQuiz).toMatchObject(updateProps1);
    });

    it('should not update if not creator', async () => {
      try {
        await service.update('invalid-id', {
          ...articleGroup2,
          name: chance.name(),
        });
      } catch (err: any) {
        expect(err.response.statusCode).toBe(401);
      }
    });
  });

  describe('remove', () => {
    it('should delete quiz by id', async () => {
      await service.remove(userId1, articleGroup1.groupId);

      const foundQuiz = await service.findById(articleGroup1.groupId);
      expect(foundQuiz).toBeFalsy();
    });

    it('should not delete if not creator', async () => {
      try {
        await service.remove('invalid-id', articleGroup2.groupId);
      } catch (err: any) {
        expect(err.response.statusCode).toBe(401);
      }
    });
  });
});
