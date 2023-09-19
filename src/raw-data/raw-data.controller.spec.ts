import { Test, TestingModule } from '@nestjs/testing';
import { RawDataController } from './raw-data.controller';

describe('RawDataController', () => {
  let controller: RawDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawDataController],
    }).compile();

    controller = module.get<RawDataController>(RawDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
