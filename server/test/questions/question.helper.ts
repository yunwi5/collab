import Chance from 'chance';
import * as lodash from 'lodash';
import { selectRandomElements } from 'src/utils/random.util';

const chance = new Chance();

export const CREATE_QUESTION_OPERATION_NAME = 'CreateQuestion';

export const UPDATE_QUESTION_OPERATION_NAME = 'UpdateQuestion';

export const REMOVE_QUESTION_OPERATION_NAME = 'RemoveQuestion';

export const CREATE_QUESTION_MUTATION = `
   mutation CreateQuestion($createQuestionInput: CreateQuestionInput!) {
      createQuestion(createQuestionInput: $createQuestionInput) {
         quizId,
         questionId,
         point,
         options,
         correctOptions,
         prompt,
         timeLimit
      }
   }
`;

export const UPDATE_QUESTION_MUTATION = `
   mutation UpdateQuestion($updateQuestionInput: UpdateQuestionInput!) {
      updateQuestion(updateQuestionInput: $updateQuestionInput) {
         quizId,
         questionId,
         point,
         options,
         correctOptions,
         prompt,
         timeLimit
      }
   }
`;

export const REMOVE_QUESTION_MUTATION = `
   mutation RemoveQuestion($questionId: String!, $quizId: String!) {
      removeQuestion(questionId: $questionId, quizId: $quizId) {
         questionId
      }
   }
`;

export const generateCreateQuestionData = (quizId: string) => {
  const options = Array(lodash.random(2, 5))
    .fill('')
    .map(() => chance.string());

  return {
    createQuestionInput: {
      quizId,
      timeLimit: lodash.random(30, 120),
      prompt: chance.string({ length: lodash.random(10, 100) }),
      point: lodash.random(1, 10),
      options,
      correctOptions: selectRandomElements(options, lodash.random(1, 5)),
    },
  };
};

export const generateUpdateQuestionData = (props: {
  quizId: string;
  questionId: string;
}) => {
  const options = Array(lodash.random(2, 5))
    .fill('')
    .map(() => chance.string());

  return {
    updateQuestionInput: {
      quizId: props.quizId,
      questionId: props.questionId,
      timeLimit: lodash.random(30, 120),
      prompt: chance.string({ length: lodash.random(10, 100) }),
      point: lodash.random(1, 10),
      options,
      correctOptions: selectRandomElements(options, lodash.random(1, 5)),
    },
  };
};
