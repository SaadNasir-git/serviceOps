import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserDeviceService } from './device/device.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller.js';

@Module({
  providers: [UserService, UserDeviceService],
  exports: [UserService, UserDeviceService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      })
    })
  ],
  controllers: [UserController]
})
export class UserModule { }