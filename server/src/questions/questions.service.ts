import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { getErrorMessage, isValidationError } from 'src/utils/error';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { Question } from './entities';
import { QuestionModel } from './db/question.model';
import { CreateQuestionInput, UpdateQuestionInput } from './dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly quizzesService: QuizzesService) {}

  async isQuizCreator(userId: string, quizId: string) {
    const foundQuiz = await this.quizzesService.findByCreatorAndQuizId(
      userId,
      quizId,
    );
    return foundQuiz != null;
  }

  async create(
    userId: string,
    createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    if (!(await this.isQuizCreator(userId, createQuestionInput.quizId)))
      throw new ForbiddenException(
        'Only the quiz creator can create the quiz question!',
      );

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

  async update(
    userId: string,
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    if (!(await this.isQuizCreator(userId, updateQuestionInput.quizId)))
      throw new ForbiddenException(
        'Only the quiz creator can update the quiz question!',
      );

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

  async remove(
    userId: string,
    quizId: string,
    questionId: string,
  ): Promise<Question> {
    if (!(await this.isQuizCreator(userId, quizId)))
      throw new ForbiddenException(
        'Only the quiz creator can update the quiz question!',
      );

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
