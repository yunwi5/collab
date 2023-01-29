import Chance from 'chance';
import { VoteKeyList } from 'src/models';
import { LevelKeyList } from 'src/models/level/Level.enum';
const chance = new Chance();

export const CREATE_QUIZ_OPERATION_NAME = 'CreateQuiz';

export const FIND_QUIZZES_OPERATION_NAME = 'Quizzes';

export const FIND_QUIZ_OPERATION_NAME = 'Quiz';

export const UPDATE_QUIZ_OPERATION_NAME = 'UpdateQuiz';

export const REMOVE_QUIZ_OPERATION_NAME = 'RemoveQuiz';

export const VOTE_QUIZ_OPERATION_NAME = 'VoteQuiz';

export const CREATE_QUIZ_MUTATION = `
   mutation CreateQuiz($createQuizInput: CreateQuizInput!) {
      createQuiz(createQuizInput: $createQuizInput) {
         quizId,
         creatorId,
         name,
         topic,
         passScore,
         tags,
         level,
         creator {
            userId,
            username
         }
      }
   }
`;

export const FIND_QUIZZES_QUERY = `
   query Quizzes {
      quizzes {
         quizId,
         creatorId,
         name,
         topic,
         passScore,
         tags,
         level,
         creator {
            userId,
            username
         },
         votes {
            userId,
            type
         },
         comments {
            parentId,
            commentId,
            userId,
            content,
         }
      }
   }
`;

export const FIND_QUIZ_QUERY = `
   query Quiz($creatorId: String!, $quizId: String!) {
      quiz(creatorId: $creatorId, quizId: $quizId) {
         quizId,
         creatorId,
         name,
         topic,
         passScore,
         tags,
         level,
         creator {
            userId,
            username
         },
         votes {
            userId,
            type
         },
         comments {
            parentId,
            commentId,
            userId,
            content,
         },
         questions {
            questionId,
            prompt,
            options,
         }
      }
   }
`;

export const UPDATE_QUIZ_MUTATION = `
   mutation UpdateQuiz($updateQuizInput: UpdateQuizInput!) {
      updateQuiz(updateQuizInput: $updateQuizInput) {
         quizId,
         creatorId,
         name,
         topic,
         passScore,
         tags,
         level,
         creator {
            userId,
            username
         },
         votes {
            userId,
            type
         },
         comments {
            parentId,
            commentId,
            userId,
            content,
         }
      }
   }
`;

export const REMOVE_QUIZ_MUTATION = `
   mutation RemoveQuiz($quizId: String!) {
      removeQuiz(quizId: $quizId) {
         quizId,
         name,
      }
   }
`;

export const VOTE_QUIZ_MUTATION = `
   mutation VoteQuiz($createVoteInput: CreateQuizVoteInput!) {
      voteQuiz(createVoteInput: $createVoteInput) {
         quizId,
         creatorId,
         name,
         creator {
            userId,
            username
         },
         votes {
            userId,
            type
         }
      }
   }
`;

export const generateCreateQuizData = () => {
  return {
    createQuizInput: {
      topic: chance.string(),
      name: chance.name(),
      passScore: chance.integer({ min: 50, max: 100 }),
      level: chance.pickone(LevelKeyList),
      tags: [chance.string(), chance.string()],
    },
  };
};

export const generateUpdateQuizData = (quizId: string) => {
  return {
    updateQuizInput: {
      quizId,
      topic: chance.string(),
      name: chance.name() + ' updated',
      passScore: chance.integer({ min: 50, max: 100 }),
      level: chance.pickone(LevelKeyList),
      tags: [chance.string(), chance.string()],
    },
  };
};

export const generateVoteQuizData = (props: {
  creatorId: string;
  quizId: string;
}) => {
  return {
    createVoteInput: {
      creatorId: props.creatorId,
      quizId: props.quizId,
      type: chance.pickone(VoteKeyList),
    },
  };
};
