import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { AuthenticatedRequest } from '../auth/authenticated-request.js';
import { getAllQuery } from './types/getAll.query.js';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @UseGuards(AuthGuard('customer'))
  async create(@Req() req: AuthenticatedRequest, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.userId, createProjectDto);
  }

  @Get()
  @UseGuards(AuthGuard('admin', 'technician', 'customer'))
  async getAll(@Req() req: AuthenticatedRequest, @Query() query: getAllQuery) {
    return this.projectService.getAll(req.user, query);
  }
}
