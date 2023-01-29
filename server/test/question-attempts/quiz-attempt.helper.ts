import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { shuffleArray } from 'src/utils/random.util';

export const SUBMIT_QUIZ_ATTEMPT_OPERATION_NAME = 'SubmitQuizAttempt';

export const FIND_QUIZ_ATTEMPT_OPERATION_NAME = 'QuizAttempt';

export const FIND_QUIZ_ATTEMPTS_BY_QUIZ_OPERATION_NAME = 'QuizAttemptsByQuiz';

export const FIND_QUIZ_ATTEMPTS_BY_USER_OPERATION_NAME = 'QuizAttemptsByUser';

export const SUBMIT_QUIZ_ATTEMPT_MUTATION = `
    mutation SubmitQuizAttempt($quizAttemptInput: QuizAttemptInput!) {
        submitQuizAttempt(quizAttemptInput: $quizAttemptInput) {
            creatorId,
            quizId,
            userId,
            score,
            scorePercentage,
            pass,
            timestamp,
            answers {
                questionId,
                selectedOptions
            }
        }
    }
`;

export const FIND_QUIZ_ATTEMPT_QUERY = `
    query QuizAttempt($quizId: String!, $userId: String!) {
        quizAttempt(quizId: $quizId, userId: $userId) {
            creatorId,
            quizId,
            userId,
            score,
            scorePercentage,
            pass,
            timestamp,
            answers {
                questionId,
                selectedOptions
            }
        }
    }
`;

export const FIND_QUIZ_ATTEMPTS_BY_QUIZ_QUERY = `
    query QuizAttemptsByQuiz($quizId: String!) {
        quizAttemptsByQuiz(quizId: $quizId) {
            creatorId,
            quizId,
            userId,
            score,
            scorePercentage,
            pass,
            timestamp,
            answers {
                questionId,
                selectedOptions
            }
        }
    }
`;

export const FIND_QUIZ_ATTEMPTS_BY_USER_QUERY = `
    query QuizAttemptsByUser($userId: String!) {
        quizAttemptsByUser(userId: $userId) {
            creatorId,
            quizId,
            userId,
            score,
            pass,
            scorePercentage,
            timestamp,
            answers {
                questionId,
                selectedOptions
            }
        }
    }
`;

export const generateSubmitQuizAttemptData = (quiz: Quiz) => {
  const randomUserAnswers = [];
  quiz.questions.forEach(question => {
    const userAnswer = {
      questionId: question.questionId,
      selectedOptions: shuffleArray(question.correctOptions),
    };
    randomUserAnswers.push(userAnswer);
  });

  return {
    quizAttemptInput: {
      quizId: quiz.quizId,
      creatorId: quiz.creatorId,
      answers: randomUserAnswers,
    },
  };
};
