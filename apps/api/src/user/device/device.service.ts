import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as argon from 'argon2';
import { userDevices } from '@repo/database';
import { CreateUserDevice } from '../interfaces/createUserDevice.interface.js';

@Injectable()
export class UserDeviceService {
    constructor(
        @InjectDrizzle() private readonly db: NodePgDatabase
    ) { }

    async createUserDevice(dto: CreateUserDevice) {
        const refreshTokenHash = await argon.hash(dto.refreshToken);
        try {
            const [created] = await this.db
                .insert(userDevices)
                .values({
                    id: dto.id,
                    userId: dto.userId,
                    refreshTokenHash
                }).returning({
                    id: userDevices.id
                });

            return created;
        } catch {
            throw new InternalServerErrorException('Something went wrong!');
        }
    }
}