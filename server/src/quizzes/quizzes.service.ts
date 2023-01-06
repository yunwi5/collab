import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { Vote } from 'src/models';
import { getErrorMessage, isValidationError } from 'src/utils/error';
import { isSameName } from 'src/utils/string.util';
import { CreateQuizInput } from './dto/create-quiz.input';
import { UpdateQuizInput } from './dto/update-quiz.input';
import { QuizModel } from './db/quiz.model';
import { Quiz } from './entities/quiz.entity';
import { CreateVoteInput } from './dto/create-vote.input';

@Injectable()
export class QuizzesService {
  async create(
    userId: string,
    createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    const quizInput = {
      creatorId: userId,
      quizId: crypto.randomUUID(),
      ...createQuizInput,
    };

    const userQuizzes = await this.findAllByCreator(userId);
    if (userQuizzes.some(quiz => isSameName(quiz.name, createQuizInput.name))) {
      throw new BadRequestException(
        'User already has the quiz of the same name.',
      );
    }

    try {
      const quiz = await QuizModel.create(quizInput);
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
    const { quizId, ...updateQuizProps } = updateQuizInput;
    const quiz = await this.findByCreatorAndQuizId(
      userId,
      updateQuizInput.quizId,
    );
    if (quiz == null) throw new NotFoundException('Quiz not found');

    try {
      const updatedQuiz = await QuizModel.update(
        { creatorId: userId, quizId },
        updateQuizProps,
      );

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
    createVoteInput: CreateVoteInput,
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
