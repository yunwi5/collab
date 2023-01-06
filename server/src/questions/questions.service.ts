import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { getErrorMessage, isValidationError } from 'src/utils/error';
import { Question } from './entities';
import { QuestionModel } from './db/question.model';
import { CreateQuestionInput, UpdateQuestionInput } from './dto';

@Injectable()
export class QuestionsService {
  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const questionInput = {
      questionId: crypto.randomUUID(),
      ...createQuestionInput,
    };

    try {
      const question = await QuestionModel.create(questionInput);
      return question;
    } catch (err) {
      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Question input invalid.');
      }
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findAllByQuizId(quizId: string): Promise<Question[]> {
    try {
      const questions = await QuestionModel.query({ quizId }).exec();
      return questions;
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async findByQuizAndQuestionId(quizId: string, questionId: string) {
    const question = await QuestionModel.get({ quizId, questionId });
    return question;
  }

  async update(updateQuestionInput: UpdateQuestionInput): Promise<Question> {
    const { quizId, questionId, ...updateQuestionProps } = updateQuestionInput;

    const question = await this.findByQuizAndQuestionId(quizId, questionId);
    if (question == null)
      throw new NotFoundException('Quiz question not found');

    try {
      const updatedQuestion = await QuestionModel.update(
        { quizId, questionId },
        updateQuestionProps,
      );
      return updatedQuestion;
    } catch (err) {
      if (err instanceof Error && isValidationError(err)) {
        throw new BadRequestException('Quiz question input is invalid');
      }
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }

  async remove(quizId: string, questionId: string): Promise<Question> {
    const question = await QuestionModel.get({ quizId, questionId });
    if (question == null)
      throw new NotFoundException('Quiz question not found.');

    try {
      await question.delete();
      return question;
    } catch (err) {
      throw new InternalServerErrorException(getErrorMessage(err));
    }
  }
}
