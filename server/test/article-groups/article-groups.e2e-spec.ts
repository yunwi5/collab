import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { E2eTestUtil } from 'test/e2e-test.util';
import { GRAPHQL_ENDPOINT } from 'test/constant';
import { signUpAndIn } from 'test/auth/auth.e2e.util';
import { ArticleGroup } from 'src/article-groups/entities';
import { find } from 'lodash';
import {
  CREATE_ARTICLE_GROUP_MUTATION,
  CREATE_ARTICLE_GROUP_OPERATION_NAME,
  FIND_ARTICLE_GROUP_QUERY,
  REMOVE_ARTICLE_GROUP_MUTATION,
  REMOVE_ARTICLE_GROUP_OPERATION_NAME,
  generateCreateArticleGroupData,
  FIND_ARTICLE_GROUP_OPERATION_NAME,
  FIND_ARTICLE_GROUPS_BY_PARENT_QUERY,
  FIND_ARTICLE_GROUPS_BY_PARENT_OPERATION_NAME,
} from './article-group.helper';

describe('Quiz resolver (e2e)', () => {
  let app: INestApplication;
  let access_token: string;
  let groupA: ArticleGroup;
  let groupAChild1: ArticleGroup;

  beforeAll(async () => {
    app = await E2eTestUtil.instance.beforeAll(__filename);

    const authResponse = await signUpAndIn(app);
    access_token = authResponse.access_token;
  });

  afterAll(async () => {
    await E2eTestUtil.instance.afterAll(__filename, app);
  });

  describe('CreateArticleGroup', () => {
    it('should create an article group', async () => {
      const createArticleGroupInputA =
        generateCreateArticleGroupData().createArticleGroupInput;

      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: CREATE_ARTICLE_GROUP_OPERATION_NAME,
          query: CREATE_ARTICLE_GROUP_MUTATION,
          variables: { createArticleGroupInput: createArticleGroupInputA },
        })
        .expect(200)
        .expect(res => {
          groupA = res.body.data.createArticleGroup;
          expect(groupA).toMatchObject(createArticleGroupInputA);
        });

      const createArticleGroupInputB = generateCreateArticleGroupData(
        groupA.groupId,
      ).createArticleGroupInput;

      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: CREATE_ARTICLE_GROUP_OPERATION_NAME,
          query: CREATE_ARTICLE_GROUP_MUTATION,
          variables: { createArticleGroupInput: createArticleGroupInputB },
        })
        .expect(200)
        .expect(res => {
          groupAChild1 = res.body.data.createArticleGroup;
          expect(groupAChild1).toMatchObject(createArticleGroupInputB);
        });
    });
  });

  describe('findArticleGroup', () => {
    it('Should find group by id and its child groups', async () => {
      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: FIND_ARTICLE_GROUP_OPERATION_NAME,
          query: FIND_ARTICLE_GROUP_QUERY,
          variables: { groupId: groupA.groupId },
        })
        .expect(200)
        .expect(res => {
          console.log(res);
          const foundGroup: ArticleGroup = res.body.data.articleGroup;
          expect(foundGroup).toMatchObject(groupA);
          expect(
            find(foundGroup.childGroups, ['groupId', groupAChild1.groupId]),
          ).toBeDefined();
        });
    });
  });

  describe('findArticleGroupsByParent', () => {
    it('Should child groups by parent', async () => {
      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: FIND_ARTICLE_GROUPS_BY_PARENT_OPERATION_NAME,
          query: FIND_ARTICLE_GROUPS_BY_PARENT_QUERY,
          variables: { parentId: groupA.groupId },
        })
        .expect(res => {
          console.log(res);
          const childGroups: ArticleGroup[] =
            res.body.data.articleGroupsByParent;
          expect(
            find(childGroups, ['groupId', groupAChild1.groupId]),
          ).toBeDefined();
        });
    });
  });

  describe('RemoveArticleGroup', () => {
    it('Should remove the group', async () => {
      await request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .auth(access_token, { type: 'bearer' })
        .send({
          operationName: REMOVE_ARTICLE_GROUP_OPERATION_NAME,
          query: REMOVE_ARTICLE_GROUP_MUTATION,
          variables: { groupId: groupA.groupId },
        })
        .expect(200)
        .expect(res => {
          const deletedGroup: ArticleGroup = res.body.data.removeArticleGroup;
          expect(deletedGroup).toBeDefined();
          expect(groupA.groupId).toEqual(deletedGroup.groupId);
        });
    });
  });
});
