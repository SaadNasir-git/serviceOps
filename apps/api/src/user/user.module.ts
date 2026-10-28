import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserDeviceService } from './device/device.service.js';

@Module({
  providers: [UserService, UserDeviceService],
  exports: [UserService, UserDeviceService]
})
export class UserModule {}