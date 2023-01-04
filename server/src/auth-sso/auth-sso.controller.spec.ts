import { Test, TestingModule } from '@nestjs/testing';
import { AuthSsoController } from './auth-sso.controller';

describe('AuthSsoController', () => {
  let controller: AuthSsoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthSsoController],
    }).compile();

    controller = module.get<AuthSsoController>(AuthSsoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
