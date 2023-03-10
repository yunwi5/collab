import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { QuestionsService } from 'src/questions/questions.service';
import { getErrorMessage, isValidationError } from 'src/utils/error.util';
import { dbTables } from 'src/config/env.config';
import { getLogger } from 'src/config/logger.config';
import { QuizAttemptInput } from './dto';
import {
  getQuizScore,
  getTotalQuizScore,
  getUserAnswersWithQuestionInfo,
} from './util';
import { QuizAttempt } from './entities';
import { QuizAttemptModel } from './db/quiz-attempt.model';

@Injectable()
export class QuizAttemptsService {
  private readonly logger = getLogger(QuizAttemptsService.name);

  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(
    createQuizAttemptInput: QuizAttemptInput,
    userId: string,
  ): Promise<QuizAttempt> {
    const { answers: userAnswers, quizId, creatorId } = createQuizAttemptInput;
    await this.deleteByQuizAndUserId(quizId, userId);

    const [quiz, questions] = await Promise.all([
      this.quizzesService.findByCreatorAndQuizId(creatorId, quizId),
      this.questionsService.findAllByQuizId(quizId),
    ]).catch(err => {
      this.logger.error(
        'cold not get quizzes and questions; err: %s;',
        getErrorMessage(err),
      );
      throw new InternalServerErrorException(
        'Could not find quiz and questions',
      );
    });

    if (quiz == null) throw new NotFoundException('Quiz not found');

    const totalScore = getTotalQuizScore(questions);
    const userQuizScore = getQuizScore(questions, userAnswers);
    const userScorePercentage = (userQuizScore / totalScore) * 100;
    const hasPassed: boolean = userScorePercentage >= quiz.passScore;

    const attemptHistory = {
      quizId,
      userId,
      creatorId,
      timestamp: Date.now(),
      score: userQuizScore,
      scorePercentage: userScorePercentage,
      pass: hasPassed,
      answers: getUserAnswersWithQuestionInfo(questions, userAnswers),
    };

    try {
      const attemptCreated = await QuizAttemptModel.create(attemptHistory);
      return attemptCreated;
    } catch (err) {
      this.logger.error(
        'could not create quiz attempt; input %s; err: %s;',
        createQuizAttemptInput,
        getErrorMessage(err),
      );
      if (isValidationError(err)) {
        throw new BadRequestException('Quiz attempt input is invalid');
      }
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAllByQuizId(quizId: string) {
    try {
      const quizAttempts = await QuizAttemptModel.query({ quizId }).exec();
      return quizAttempts;
    } catch (err) {
      this.logger.error(
        'could not find attempts by quiz ID; quiz ID: %s; err: %s;',
        quizId,
        getErrorMessage(err),
      );
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAllByUserId(userId: string) {
    try {
      const userAttempts = await QuizAttemptModel.query('userId')
        .eq(userId)
        .using(dbTables.QuizAttemptUserIndex)
        .sort('descending')
        .exec();

      return userAttempts;
    } catch (err) {
      this.logger.error(
        'could not find attempts by user ID; user ID: %s;',
        userId,
      );
      return null;
    }
  }

  async findByQuizAndUserId(
    quizId: string,
    userId: string,
  ): Promise<QuizAttempt> {
    return QuizAttemptModel.get({ quizId, userId });
  }

  async deleteByQuizAndUserId(quizId: string, userId: string) {
    return QuizAttemptModel.delete({ quizId, userId });
  }
}
