import Chance from 'chance';
import { VoteKeyList } from 'src/models';
const chance = new Chance();

export const CREATE_COMMENT_OPERATION_NAME = 'CreateComment';

export const CREATE_COMMENT_MUTATION = `
    mutation CreateComment($createCommentInput: CreateCommentInput!) {
        createComment(createCommentInput: $createCommentInput) {
            commentId,
            parentId,
            userId,
            replyTo,
            content,
            createdAt,
            updatedAt,
            votes {
                userId,
                type
            }
        }
    }
`;

export const generateCreateCommentData = (props: {
  parentId: string;
  replyTo?: string;
}) => {
  return {
    createCommentInput: {
      parentId: props.parentId,
      replyTo: props.replyTo,
      content: chance.string({ alpha: true }),
    },
  };
};
