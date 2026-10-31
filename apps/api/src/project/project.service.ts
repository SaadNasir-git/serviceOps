import { Injectable } from '@nestjs/common';
import { Project } from './dto/create-project.dto.js';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ProjectRepositry } from './project.repostiry.js';
import { UserService } from '../user/user.service.js';
import { getAllQuery } from './types/getAll.query.js';
import { Role } from '../user/types/roles.js';
import { categories, projectMembers, projects } from '@repo/database';
import { and, eq, ilike, or } from 'drizzle-orm';
import { AccessToken } from '../user/interfaces/accessToken.interface.js';

@Injectable()
export class ProjectService {
  constructor(
    @InjectDrizzle() private readonly db: NodePgDatabase,
    private readonly projectRepo: ProjectRepositry,
    private readonly UserService: UserService
  ) { }

  async create(customerId: string, dto: Project) {
    return this.projectRepo.create({
      customerId,
      ...dto
    });
  }

  async getAll(user: AccessToken, query: getAllQuery) {
    let fields = {
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      dueDate: projects.dueDate
    }

    const base = this.db.select(fields).from(projects);

    const conditions = [];

    if (query.filter) {
      conditions.push(eq(projects.status, query.filter))
    }
    if (query.query) {
      const like = `%${query.query.trim()}%`;
      conditions.push(
        or(
          ilike(projects.title, like),
          ilike(projects.description, like),
        )
      );
    }

    if (user.role === Role.Customer || user.role === Role.Admin) {
      const whereClause = user.role === Role.Admin ? and(...conditions) : and(...conditions, eq(projects.customerId, user.userId));
      const rows = await base.leftJoin(categories, eq(projects.categoryId, categories.id)).where(whereClause);

      return rows;
    } else if (user.role === Role.Technician) {
      const rows = await this.db
        .select({ ...fields, leading: projectMembers.leading })
        .from(projects)
        .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
        .leftJoin(categories, eq(projects.categoryId, categories.id))
        .where(and(...conditions, eq(projectMembers.userId, user.userId)));

      return rows;
    }
  }
}
