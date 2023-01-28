import Chance from 'chance';
import * as lodash from 'lodash';
import { selectRandomElements } from 'src/utils/random.util';

const chance = new Chance();

export const CREATE_QUESTION_OPERATION_NAME = 'CreateQuestion';

export const UPDATE_QUESTION_OPERATION_NAME = 'UpdateQuestion';

export const DELETE_QUESTION_OPERATION_NAME = 'DeleteQuestion';

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
