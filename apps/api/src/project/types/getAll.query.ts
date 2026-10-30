import { projectStatusEnum } from '@repo/database'

export interface getAllQuery {
    filter?: (typeof projectStatusEnum.enumValues)[number]
    query?: string;
}