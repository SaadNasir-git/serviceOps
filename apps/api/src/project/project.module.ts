import { Module } from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { ProjectController } from './project.controller.js';
import { UserModule } from '../user/user.module.js';
import { ProjectRepositry } from './project.repostiry.js';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepositry],
  imports: [UserModule]
})
export class ProjectModule { }
