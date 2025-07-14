import { Test, TestingModule } from '@nestjs/testing';
import { ConfigureMockController } from './configure-mock.controller';

describe('configureMock', () => {
  let controller: ConfigureMockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigureMockController],
    }).compile();

    controller = module.get<ConfigureMockController>(ConfigureMockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
