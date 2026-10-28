import { Test, TestingModule } from '@nestjs/testing';
import { UserDeviceService } from './device.service.js';

describe('DeviceService', () => {
  let service: UserDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDeviceService],
    }).compile();

    service = module.get<UserDeviceService>(UserDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
