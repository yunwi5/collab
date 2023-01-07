import { Question } from 'src/questions/entities';
import { QuestionAttemptInput } from './dto';

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
}

export const getTotalQuizScore = (questions: Question[]): number => {
  return questions.reduce((total, question) => total + question.point, 0);
};

export const getQuizScore = (
  questions: Question[],
  answers: QuestionAttemptInput[],
): number => {
  const questionMap: Map<string, Question> = new Map(
    questions.map(question => [question.questionId, question]),
  );

  const acquiredPoints = answers.reduce((accPoints, currAnswer) => {
    const question = questionMap.get(currAnswer.questionId);
    if (question == null) {
      console.warn(
        `Question does not exist; question id: ${currAnswer.questionId};`,
      );
      return accPoints;
    }

    if (arraysEqual(currAnswer.selectedOptions, question.correctOptions)) {
      return accPoints + question.point;
    }
    return accPoints;
  }, 0);

  return acquiredPoints;
};
