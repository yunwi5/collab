import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import crypto from 'crypto';

import { Vote } from 'src/models';
import { getErrorMessage, isValidationError } from 'src/utils/error.util';
import { isSameName } from 'src/utils/string.util';
import { QuestionsService } from 'src/questions/questions.service';
import { CreateQuestionBaseInput } from 'src/questions/dto';
import { getLogger } from 'src/config/logger.config';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { QuizModel } from './db/quiz.model';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizVoteInput } from './dto/create-quiz-vote.input';

@Injectable()
export class QuizzesService {
  private readonly logger = getLogger(QuizzesService.name);

  constructor(
    @Inject(forwardRef(() => QuestionsService))
    private readonly questionsService: QuestionsService,
  ) {}

  assignQuizIdToQuestions(
    quizId: string,
    questions: CreateQuestionBaseInput[],
  ) {
    return questions.map(q => ({ ...q, quizId }));
  }

  async create(
    userId: string,
    createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    const { questions = [], ...quizProps } = createQuizInput;

    const quizInput = {
      creatorId: userId,
      quizId: crypto.randomUUID(),
      ...quizProps,
    };

    const userQuizzes = await this.findAllByCreator(userId);
    if (userQuizzes.some(quiz => isSameName(quiz.name, createQuizInput.name))) {
      throw new BadRequestException(
        'User already has the quiz of the same name.',
      );
    }

    try {
      const quiz = await QuizModel.create(quizInput);
      await this.questionsService.batchCreate(
        userId,
        this.assignQuizIdToQuestions(quiz.quizId, questions),
      );

      return quiz;
    } catch (err) {
      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Quiz input is not acceptable');
      }

      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAllByCreator(creatorId: string): Promise<Quiz[]> {
    try {
      const quizzes = await QuizModel.query({ creatorId }).exec();
      return quizzes;
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAll(): Promise<Quiz[]> {
    try {
      const quizzes = await QuizModel.scan().exec();
      this.logger.info('find all quizzes; count: %s;', quizzes.length);
      return quizzes;
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findByCreatorAndQuizId(
    creatorId: string,
    quizId: string,
  ): Promise<Quiz> {
    try {
      const item = await QuizModel.get({ creatorId, quizId });
      return item;
    } catch (err) {
      return null;
    }
  }

  async update(
    userId: string,
    updateQuizInput: UpdateQuizInput,
  ): Promise<Quiz> {
    const { quizId, questions = [], ...updateQuizProps } = updateQuizInput;
    const quiz = await this.findByCreatorAndQuizId(
      userId,
      updateQuizInput.quizId,
    );
    if (quiz == null) throw new NotFoundException('Quiz not found');

    try {
      const [updatedQuiz] = await Promise.all([
        QuizModel.update({ creatorId: userId, quizId }, updateQuizProps),
        this.questionsService.batchCreate(
          userId,
          this.assignQuizIdToQuestions(quiz.quizId, questions),
        ),
      ]);

      return updatedQuiz;
    } catch (err) {
      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Quiz input is not acceptable');
      }
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async remove(userId: string, quizId: string): Promise<Quiz> {
    const quiz = await this.findByCreatorAndQuizId(userId, quizId);
    if (quiz == null) throw new NotFoundException('Quiz not found');

    try {
      await quiz.delete();
      return quiz;
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async voteQuiz(
    userId: string,
    createVoteInput: CreateQuizVoteInput,
  ): Promise<Quiz> {
    const quiz = await this.findByCreatorAndQuizId(
      createVoteInput.creatorId,
      createVoteInput.quizId,
    );

    if (quiz == null) throw new NotFoundException('Quiz not found');

    const vote: Vote = {
      userId,
      type: createVoteInput.type,
    };

    const filteredVotes = (quiz.votes || []).filter(v => v.userId !== userId);
    quiz.votes = [...filteredVotes, vote];

    await quiz.save();
    return quiz;
  }
}
