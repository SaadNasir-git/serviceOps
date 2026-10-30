import { InjectDrizzle } from "@nestjs/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Project } from "./dto/create-project.dto.js";
import { projects } from "@repo/database";

export class ProjectRepositry {
    constructor(@InjectDrizzle() private readonly db: NodePgDatabase) { }

    async create(dto: { customerId: string } & Project) {
        await this.db.insert(projects).values({
            customerId: dto.customerId,
            title: dto.title,
            description: dto.description,
            budgetAmount: dto.budgetAmount,
            currency: dto.currency,
            dueDate: dto.dueDate,
            categoryId: dto.categoryId ?? null,
        });
    }
}