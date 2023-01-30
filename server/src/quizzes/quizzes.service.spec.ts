import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import Chance from 'chance';
import { User } from 'src/users/entities';
import { LevelType } from 'src/models/level/Level.enum';
import { QuizzesModule } from './quizzes.module';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInput } from './dto';
import { Quiz } from './entities/quiz.entity';

const chance = new Chance();

describe('QuizzesService', () => {
  let usersService: UsersService;
  let quizzesService: QuizzesService;
  let user: User;
  let quiz: Quiz;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzesModule],
      imports: [QuizzesModule],
    }).compile();

    usersService = new UsersService();
    quizzesService = module.get(QuizzesService);

    user = await usersService.create({
      username: chance.name(),
      email: chance.email(),
      password: chance.string({ length: 8 }),
    });
  });

  it('should be defined', () => {
    expect(quizzesService).toBeDefined();
  });

  it('should create a quiz', async () => {
    const createQuizDto: CreateQuizInput = {
      name: `quiz-${chance.name()}`,
      topic: chance.string({ alpha: true }),
      tags: [],
      level: LevelType.BEGINNER,
      passScore: 50,
    };

    quiz = await quizzesService.create(user.userId, createQuizDto);
    expect(quiz).toMatchObject(createQuizDto);
    expect(quiz.quizId).toBeDefined();
    expect(quiz.createdAt).toBeNumber();
    expect(quiz.updatedAt).toBeNumber();
  });

  it('should remove a quiz', async () => {
    const deletedQuiz = await quizzesService.remove(user.userId, quiz.quizId);
    console.log(typeof deletedQuiz.createdAt.valueOf());
    expect(deletedQuiz.quizId).toEqual(quiz.quizId);
  });
});
