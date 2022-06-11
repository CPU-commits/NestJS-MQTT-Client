import { Test, TestingModule } from '@nestjs/testing';
import { MetricsGateway } from './metrics.gateway';

describe('MetricsGateway', () => {
  let gateway: MetricsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsGateway],
    }).compile();

    gateway = module.get<MetricsGateway>(MetricsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
