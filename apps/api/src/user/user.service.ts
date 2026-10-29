import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { userDevices, users } from '@repo/database';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as argon from 'argon2'
import { createUser } from '../auth/dto/create-user.dto.js';

@Injectable()
export class UserService {
    constructor(
        @InjectDrizzle() private readonly db: NodePgDatabase
    ) { }

    async createUser(dto: createUser) {
        const passwordHash = (await argon.hash(dto.password)).toString();
        try {
            const [created] = await this.db
                .insert(users)
                .values({ name: dto.name, email: dto.email, passwordHash: passwordHash })
                .returning({ userId: users.id });

            return created;
        } catch (err) {
            const code = (err as any)?.code ?? (err as any)?.cause?.code;
            if (code === '23505') throw new ConflictException('Email already in use');
            throw new InternalServerErrorException('Something went wrong!');
        }
    }

    async selectUser(userData: { userId: string, email?: null } | { userId?: null, email: string }) {
        const [result] = await this.db.select({
            userId: users.id,
            passwordHash: users.passwordHash
        }).from(users)
            .where(eq(userData.email ? users.email : users.id, userData.userId ?? userData.email))
        return result;
    }

    async selectUserByDeviceId(deviceId: string) {
        const [user] = await this.db
            .select({
                deviceId: userDevices.id,
                userId: userDevices.userId,
                email: users.email,
                name: users.name,
                refreshTokenHash: userDevices.refreshTokenHash,
                role: users.role
            })
            .from(userDevices)
            .innerJoin(users, eq(users.id, userDevices.userId))
            .where(eq(userDevices.id, deviceId));
        return user;
    }

    async updateUserPassword(newPassword: string) {
        const passwordHash = (await argon.hash(newPassword)).toString();
        await this.db.update(users).set({
            passwordHash
        }).returning({ userId: users.id });
    }
}