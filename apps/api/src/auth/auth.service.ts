import { Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { createUser, CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { HttpAdapterHost } from '@nestjs/core';
import { LoginDto, LoginStrategy } from './dto/login.dto.js';
import { randomInt, randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt'
import { CacheService } from '../cache/cache.service.js';
import * as argon from 'argon2'
import { EmailService } from '../email/email.service.js';
import { hmac } from '../common/hmac.js';
import type { FastifyReply } from 'fastify';
import { UserDeviceService } from '../user/device/device.service.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly userDeviceService: UserDeviceService,
        private readonly adapterHost: HttpAdapterHost,
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
        private readonly emailService: EmailService
    ) { }

    async createUser(dto: createUser) {
        return this.userService.createUser(dto);
    }

    async login(dto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
        try {

            const user = await this.userService.selectUser({
                email: dto.email
            });

            if (!user) {
                return {
                    message: "User is not signed up, Signup first."
                }
            }

            if (!user.passwordHash) {
                return {
                    message: "User signed up with provider before and now trying to login with email."
                }
            }

            const isCorrect = await argon.verify(user.passwordHash, dto.password);

            if (!isCorrect) {
                return {
                    message: "Wrong Password!"
                }
            }

            const uniqueId = randomUUID();

            if (dto.strategy === LoginStrategy.URL) {
                const token = await this.jwtService.signAsync({
                    id: uniqueId,
                    purpose: 'authentication'
                }, { expiresIn: '24h' })

                await this.cacheService.set<'AUTH:TOKEN'>(`AUTH:TOKEN:${uniqueId}`, {
                    userId: user.userId,
                    callBackUrl: dto.callBackUrl
                }, 24 * 60 * 60);

                this.emailService.add('url', {
                    email: dto.email,
                    verifyUrl: `${process.env.BASE_URL}${process.env.PREFIX}/auth/verify-email?token=${token}`,
                });

                this.cacheService.set<"AUTH:TOKEN">(`AUTH:TOKEN:${uniqueId}`, {
                    userId: user.userId,
                    callBackUrl: dto.callBackUrl
                });

                res.code(200);
                return {
                    message: "Verification Email will be sent to your email shortly."
                }
            } else if (dto.strategy === LoginStrategy.OTP) {
                const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
                const hashedCode = hmac(code.toString());
                await this.cacheService.set<"AUTH:OTP">(`AUTH:OTP:${uniqueId}`, {
                    code: hashedCode,
                    tries: 0,
                    userId: user.userId
                }, 5 * 60);

                await this.emailService.add('otp', {
                    code,
                    email: dto.email
                });

                res.setCookie('uniqueId', uniqueId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60,
                    path: `${process.env.PREFIX}/auth`
                });

                res.code(200);
                return {
                    message: "OTP will be sent to your email shortly"
                }
            }
        } catch {
            throw new InternalServerErrorException('Something went wrong!');
        }
    }

    async verifyEmail(token: string, cookie: string, res: FastifyReply) {
        const decodedPayload = await this.jwtService.verifyAsync<{ id: string; purpose: string }>(token);
        const uniqueId = decodedPayload.id;
        const tokenDetails = await this.cacheService.getdel<"AUTH:TOKEN">(`AUTH:TOKEN:${uniqueId}`);

        if (!tokenDetails) {
            res.code(400)
            return {
                message: "Verification token has been expired!"
            };
        }

        const user = await this.userService.selectUser({ userId: tokenDetails.userId });
        const deviceId = randomUUID()

        const refreshToken = await this.jwtService.signAsync({
            deviceId
        }, {
            expiresIn: '7d'
        });

        await this.userDeviceService.createUserDevice({
            id: deviceId,
            userId: user.userId,
            refreshToken
        });

        res.setCookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: `${process.env.PREFIX}/auth`
        });

        return res.redirect(tokenDetails.callBackUrl);
    }

    
}