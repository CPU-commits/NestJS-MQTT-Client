import { Test, TestingModule } from '@nestjs/testing';
import { MqttController } from './mqtt.controller';

describe('MqttController', () => {
  let controller: MqttController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MqttController],
    }).compile();

    controller = module.get<MqttController>(MqttController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
