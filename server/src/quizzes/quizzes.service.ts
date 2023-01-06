import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { getErrorMessage, isValidationError } from 'src/utils/error';
import { Vote } from 'src/models';
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
    try {
      const quizInput = {
        creatorId: userId,
        quizId: crypto.randomUUID(),
        ...createQuizInput,
      };
      const quiz = await QuizModel.create(quizInput);
      return quiz;
    } catch (err) {
      const message = getErrorMessage(err);
      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Quiz input is not acceptable');
      }

      throw new InternalServerErrorException(message);
    }
  }

  async findAll(): Promise<Quiz[]> {
    try {
      const quizzes = await QuizModel.scan().exec();
      return quizzes;
    } catch (err) {
      const message = getErrorMessage(err);
      throw new InternalServerErrorException(message);
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
    console.log({ updateQuizProps });
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
