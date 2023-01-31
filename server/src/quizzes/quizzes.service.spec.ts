import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import Chance from 'chance';
import { User } from 'src/users/entities';
import { LevelTypeList } from 'src/models/level/Level.enum';
import { getRandomInt, selectRandomElement } from 'src/utils/random.util';
import { find } from 'lodash';
import { QuizzesModule } from './quizzes.module';
import { QuizzesService } from './quizzes.service';
import { CreateQuizInput, UpdateQuizInput } from './dto';
import { Quiz } from './entities/quiz.entity';

const chance = new Chance();

const createRandomCreateQuizInput = (): CreateQuizInput => ({
  name: `quiz-${chance.name()}`,
  topic: chance.string({ alpha: true }),
  tags: [chance.string()],
  level: selectRandomElement(LevelTypeList),
  passScore: getRandomInt(50, 100),
});

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
    const createQuizDto: CreateQuizInput = createRandomCreateQuizInput();

    quiz = await quizzesService.create(user.userId, createQuizDto);
    expect(quiz).toMatchObject(createQuizDto);
    expect(quiz.quizId).toBeDefined();
    expect(quiz.createdAt).toBeNumber();
    expect(quiz.updatedAt).toBeNumber();
  });

  it('should find by creator', async () => {
    const userQuizzes: Quiz[] = await quizzesService.findAllByCreator(
      user.userId,
    );
    expect(find(userQuizzes, ['quizId', quiz.quizId])).toBeDefined();
  });

  it('should update the quiz', async () => {
    const updateQuizDto: UpdateQuizInput = {
      quizId: quiz.quizId,
      name: `quiz-${chance.name()}-updated`,
      topic: chance.string({ alpha: true }),
      tags: [chance.string({ alpha: true }), chance.string({ alpha: true })],
      level: selectRandomElement(LevelTypeList),
      passScore: getRandomInt(50, 100),
    };

    quiz = await quizzesService.update(user.userId, updateQuizDto);
    expect(quiz.quizId).toBeDefined();
    expect(quiz.name).toEqual(updateQuizDto.name);
    expect(quiz.topic).toEqual(updateQuizDto.topic);
    expect(quiz.passScore).toEqual(updateQuizDto.passScore);
    expect(quiz.level).toEqual(updateQuizDto.level);
    expect(quiz.tags).toEqual(updateQuizDto.tags);
  });

  it('should remove a quiz', async () => {
    const deletedQuiz = await quizzesService.remove(user.userId, quiz.quizId);
    console.log(typeof deletedQuiz.createdAt.valueOf());
    expect(deletedQuiz.quizId).toEqual(quiz.quizId);
  });
});
