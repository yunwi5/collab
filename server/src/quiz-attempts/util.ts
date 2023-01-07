import { Question } from 'src/questions/entities';
import { QuestionAttemptInput } from './dto';
import { QuestionAttempt } from './entities';

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
}

export const getTotalQuizScore = (questions: Question[]): number => {
  return questions.reduce((total, question) => total + question.point, 0);
};

export const getQuestionMap = (questions: Question[]) => {
  const questionMap: Map<string, Question> = new Map(
    questions.map(question => [question.questionId, question]),
  );

  return questionMap;
};

export const getQuizScore = (
  questions: Question[],
  answers: QuestionAttemptInput[],
): number => {
  const questionMap = getQuestionMap(questions);

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

export const getUserAnswersWithQuestionInfo = (
  questions: Question[],
  answers: QuestionAttemptInput[],
): QuestionAttempt[] => {
  const questionMap = getQuestionMap(questions);

  const answersWithQuestions: QuestionAttempt[] = answers
    .map(ans => {
      const question = questionMap.get(ans.questionId);
      if (question == null) return null;

      return {
        ...ans,
        prompt: question.prompt,
        options: question.options,
        correctOptions: question.correctOptions,
        point: question.point,
        createdAt: new Date(question.createdAt).getTime(),
      };
    })
    .filter(qs => !!qs);

  return answersWithQuestions;
};
