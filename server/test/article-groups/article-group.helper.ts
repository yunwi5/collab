import Chance from 'chance';

const chance = new Chance();

export const CREATE_ARTICLE_GROUP_OPERATION_NAME = 'CreateArticleGroup';

export const FIND_ARTICLE_GROUP_OPERATION_NAME = 'ArticleGroup';

export const FIND_ARTICLE_GROUPS_BY_CREATOR_OPERATION_NAME =
  'ArticleGroupByCreator';

export const UPDATE_ARTICLE_GROUP_OPERATION_NAME = 'UpdateArticleGroup';

export const REMOVE_ARTICLE_GROUP_OPERATION_NAME = 'RemoveArticleGroup';

export const CREATE_ARTICLE_GROUP_MUTATION = `
    mutation CreateArticleGroup($createArticleGroupInput: CreateArticleGroupInput!) {
        createArticleGroup(createArticleGroupInput: $createArticleGroupInput) {
            parentId,
            groupId,
            name,
            icon
        }
    }
`;

export const FIND_ARTICLE_GROUP_MUTATION = `
    query ArticleGroup($groupId: String!) {
        articleGroup(groupId: $groupId) {
            groupId,
            creatorId,
            name,
            icon
        }
    }
`;

export const UPDATE_ARTICLE_GROUP_MUTATION = `
    mutation UpdateArticleGroup($updateArticleGroupInput: UpdateArticleGroupInput!) {
        updateArticleGroup(updateArticleGroupInput: $updateArticleGroupInput) {
            groupId,
            creatorId,
            name,
            icon
        }
    }
`;

export const REMOVE_ARTICLE_GROUP_MUTATION = `
    mutation RemoveArticleGroup($groupId: String!) {
        removeArticleGroup(groupId: $groupId) {
            groupId,
            creatorId,
            name,
            icon
        }
    }
`;

export const generateCreateArticleGroupData = (parentId: string = null) => {
  if (parentId == null)
    return {
      createArticleGroupInput: {
        name: chance.name({ prefix: true }),
        icon: chance.name({ prefix: true }),
      },
    };

  return {
    createArticleGroupInput: {
      parentId,
      name: chance.name({ prefix: true }),
      icon: chance.name({ prefix: true }),
    },
  };
};

export const generateUpdateArticleGroupData = (props: {
  creatorId: string;
  groupId: string;
}) => {
  return {
    updateArticleGroupInput: {
      ...props,
      name: chance.name({ prefix: true }),
      icon: chance.name({ prefix: true }),
    },
  };
};
