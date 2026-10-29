import { Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { createUser } from './dto/create-user.dto.js';
import { UserService } from '../user/user.service.js';
import { LoginDto, LoginStrategy } from './dto/login.dto.js';
import { randomInt, randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt'
import { CacheService } from '../cache/cache.service.js';
import * as argon from 'argon2'
import { EmailService } from '../email/email.service.js';
import { hmac, verifyHmac } from '../common/hmac.js';
import type { FastifyReply } from 'fastify';
import { UserDeviceService } from '../user/device/device.service.js';
import { unique } from 'drizzle-orm/pg-core';

type RefreshToken = { deviceId: string; iat: number };
const cookiePath = `${process.env.PREFIX}/auth`;

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly userDeviceService: UserDeviceService,
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
                }, { ttl: 24 * 60 * 60 });

                this.emailService.add('url', {
                    email: dto.email,
                    verifyUrl: `${process.env.BASE_URL}${process.env.PREFIX}/auth/verify-email?token=${token}`,
                });

                this.cacheService.set<"AUTH:TOKEN">(`AUTH:TOKEN:${uniqueId}`, {
                    userId: user.userId,
                    callBackUrl: dto.callBackUrl
                }, { ttl: 24 * 60 * 60 });

                return {
                    message: "Verification Email will be sent to your email shortly."
                }
            } else if (dto.strategy === LoginStrategy.OTP) {
                await this.cacheService.set<'AUTH:SESSION'>(`AUTH:SESSION:${uniqueId}`, {
                    userId: user.userId,
                    email: dto.email,
                    resendCount: 0,
                    lastSentAt: Date.now()
                }, { ttl: 15 * 60 })

                const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
                await this.cacheService.set<"AUTH:OTP">(`AUTH:OTP:${uniqueId}`, {
                    code: hmac(code),
                    tries: 0,
                    userId: user.userId
                }, { ttl: 5 * 60 });

                await this.emailService.add('otp', {
                    code,
                    email: dto.email
                });

                res.setCookie('uniqueId', uniqueId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60,
                    path: cookiePath
                });

                return {
                    message: "OTP will be sent to your email shortly"
                }
            }
        } catch {
            throw new InternalServerErrorException('Something went wrong!');
        }
    }

    async verifyEmail(token: string, res: FastifyReply) {
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
            path: cookiePath
        });

        return res.redirect(tokenDetails.callBackUrl);
    }

    async verifyOtp(otp: string, uniqueId: string, res: FastifyReply) {
        if (!uniqueId) {
            return res.code(400).send({
                message: "OTP has been expired."
            })
        }

        const codeDetails = await this.cacheService.get<"AUTH:OTP">(`AUTH:OTP:${uniqueId}`);
        if (!codeDetails) {
            return res.code(400).send({
                message: "OTP has been expired."
            })
        }

        const isCorrect = verifyHmac(otp, codeDetails.code);

        if (!isCorrect) {
            codeDetails.tries += 1;
            if (codeDetails.tries >= 5) {
                await this.cacheService.del([`AUTH:OTP:${uniqueId}`, `AUTH:SESSION:${uniqueId}`])
                res.clearCookie('uniqueId', { path: cookiePath })
                return res.code(400).send({ message: 'Too many attempts. Please login again.' });
            }

            await this.cacheService.set<"AUTH:OTP">(`AUTH:OTP:${unique}`, codeDetails, { keepExisting: true });
            return res.code(400).send({
                message: "Invalid OTP."
            })
        }

        await this.cacheService.del([`AUTH:OTP:${uniqueId}`, `AUTH:SESSION:${uniqueId}`]);
        const user = await this.userService.selectUser({ userId: codeDetails.userId });

        const deviceId = randomUUID();
        const refreshToken = await this.jwtService.signAsync({
            deviceId
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
            path: cookiePath
        });
        res.clearCookie('uniqueId', { path: cookiePath })

        return {
            message: "User verified successfully"
        };
    }

    async resendOtp(uniqueId: string, res: FastifyReply) {
        if (!uniqueId) {
            return res.code(400).send({ message: 'Session expired. Please login again.' });
        }

        const session = await this.cacheService.get<'AUTH:SESSION'>(`AUTH:SESSION:${uniqueId}`);
        if (!session) {
            return res.code(400).send({ message: 'Session expired. Please login again.' });
        }

        if (Date.now() - session.lastSentAt < 60_000) {
            return res.code(429).send({ message: 'Please wait before requesting another code.' });
        }

        if (session.resendCount >= 5) {
            await this.cacheService.del([`AUTH:SESSION:${uniqueId}`, `AUTH:OTP:${uniqueId}`]);
            res.clearCookie('uniqueId', { path: cookiePath })
            return res.code(429).send({ message: 'Too many resends. Please login again.' });
        }

        const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
        await this.cacheService.set<'AUTH:OTP'>(`AUTH:OTP:${uniqueId}`, {
            userId: session.userId,
            code: hmac(code),
            tries: 0
        }, { ttl: 5 * 60 });

        await this.cacheService.set<'AUTH:SESSION'>(`AUTH:SESSION:${uniqueId}`, {
            userId: session.userId,
            email: session.email,
            resendCount: session.resendCount + 1,
            lastSentAt: Date.now()
        }, { keepExisting: true });

        await this.emailService.add('otp', {
            email: session.email,
            code: code
        });

        return {
            message: 'A new code has been sent.'
        };
    }

    async getAccessToken(refreshToken: string, res: FastifyReply) {
        const decodedPayload = await this.jwtService.verifyAsync<RefreshToken>(refreshToken);
        const user = await this.userService.selectUserByDeviceId(decodedPayload.deviceId);

        const isCorrect = await argon.verify(decodedPayload.deviceId, user.refreshTokenHash);

        if (!isCorrect) {
            res.clearCookie('refreshToken', { path: cookiePath });
            return res.code(401).send({ message: 'Session revoked. Please log in again.' });
        }

        const accessToken = await this.jwtService.signAsync({
            userId: user.userId,
            email: user.email,
            name: user.name,
            deviceId: user.deviceId,
            role: user.role
        }, { expiresIn: '15m' });

        return {
            accessToken
        }
    }

    async rotateRefreshToken(refreshToken: string, res: FastifyReply) {
        if (!refreshToken) {
            return res.code(401).send({ message: 'Unauthorized' });
        }

        const decodedPayload = await this.jwtService.verifyAsync<RefreshToken>(refreshToken);

        const user = await this.userService.selectUserByDeviceId(decodedPayload.deviceId);

        const isCorrect = await argon.verify(refreshToken, user.refreshTokenHash);
        if (!isCorrect) {
            res.clearCookie('refreshToken', { path: cookiePath });
            return res.code(401).send({ message: 'Session revoked. Please log in again.' });
        }

        const accessToken = await this.jwtService.signAsync({
            userId: user.userId,
            email: user.email,
            name: user.name,
            deviceId: user.deviceId,
            role: user.role
        }, { expiresIn: '15m' });

        const ageSeconds = Math.floor(Date.now() / 1000) - decodedPayload.iat;
        const shouldRotate = ageSeconds >= 24 * 60 * 60;

        if (!shouldRotate) {
            return res.send({ accessToken });
        }

        const newRefreshToken = await this.jwtService.signAsync({
            deviceId: user.deviceId
        }, { expiresIn: '7d' });

        await this.userDeviceService.updateRefreshToken(decodedPayload.deviceId, newRefreshToken);

        res.setCookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        });

        return { accessToken };
    }

    async forgotPassword(email: string) {
        let user: {
            userId: string;
            passwordHash: string;
        };
        try {
            user = await this.userService.selectUser({ email });
        } catch {
            return {
                message: "Email sent successfully."
            }
        }

        if (!user) {
            return {
                message: "Email sent successfully."
            }
        }

        const tokenId = randomUUID();
        const token = await this.jwtService.signAsync({
            userId: user.userId,
            tokenId: tokenId,
            purpose: 'forgot-password'
        }, { expiresIn: '30m' });

        await this.cacheService.set<"AUTH:RESET">(`AUTH:RESET:${user.userId}`, tokenId, {
            ttl: 30 * 60
        });

        await this.emailService.add('reset', {
            email,
            forgotPasswordUrl: `${process.env.BASE_URL}/reset-password?token=${token}`
        });

        return {
            message: "Email sent successfully."
        }
    }

    async resetPassword(token: string, password: string, res: FastifyReply) {
        const decodedPayload = await this.jwtService.verifyAsync<{ userId: string; tokenId: string; purpose: string }>(token);

        if (decodedPayload.purpose !== 'forgot-password') {
            return res.code(400).send({
                message: "Invalid Token"
            })
        }

        const tokenId = await this.cacheService.get<"AUTH:RESET">(`AUTH:RESET:${decodedPayload.userId}`);
        if (!tokenId || tokenId !== decodedPayload.tokenId) {
            return res.code(400).send({
                message: "Token has been expired"
            })
        }

        await this.cacheService.del(`AUTH:RESET:${decodedPayload.userId}`);

        await this.userService.updateUserPassword(password);
        await this.userDeviceService.deleteAllUserDevices(decodedPayload.userId);

        return {
            message: "Password updated successfully"
        };
    }

    async logOut(refreshToken: string, res: FastifyReply) {
        if (refreshToken) {

            const decodedPayload = await this.jwtService.verifyAsync<RefreshToken>(refreshToken);
            await this.userDeviceService.deleteUserDevice(decodedPayload.deviceId);
        }

        await res.clearCookie('refreshToken', { path: cookiePath }).send({ message: 'Loged Out' });
    }

    async logOutAll(refreshToken: string, res: FastifyReply) {
        if (!refreshToken) {
            return res.code(401).send({ message: "Unauthorized" });
        }

        const decodedPayload = await this.jwtService.verifyAsync<RefreshToken>(refreshToken);
        const user = await this.userService.selectUserByDeviceId(decodedPayload.deviceId);

        await this.userDeviceService.deleteAllUserDevices(user.userId);

        res.clearCookie('refreshToken', { path: cookiePath });
        return {
            message: 'Logged out of all devices.'
        }
    }
}