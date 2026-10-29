import { Body, Controller, Cookies, Get, HttpCode, Param, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { FastifyReply } from 'fastify';
import { VerifyOtpDto } from './dto/otp.dto.js';
import { ForgotPasswordDto } from './dto/fotgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) { }

    @HttpCode(201)
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.AuthService.createUser(createUserDto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.login(loginDto, res);
    }

    @HttpCode(308)
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.verifyEmail(token, res);
    }

    @HttpCode(200)
    @Post('verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Cookies('uniqueId') uniqueId: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.verifyOtp(verifyOtpDto.otp, uniqueId, res);
    }

    @HttpCode(202)
    @Get('resend-otp')
    async resendOtp(@Cookies('uniqueId') uniqueId: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.resendOtp(uniqueId, res);
    }

    @HttpCode(200)
    @Get('access-token')
    async accessToken(@Cookies('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.getAccessToken(refreshToken, res);
    }

    @HttpCode(200)
    @Get('refresh')
    async rotateRefreshToken(@Cookies('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.rotateRefreshToken(refreshToken, res);
    }

    @HttpCode(200)
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.AuthService.forgotPassword(forgotPasswordDto.email);
    }

    @HttpCode(200)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('token') token: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.resetPassword(token, resetPasswordDto.password, res);
    }

    @HttpCode(200)
    @Post('logout')
    async logOut(@Cookies('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.logOut(refreshToken, res);
    }

    @HttpCode(200)
    @Post('logout-all')
    async logOutAll(@Cookies('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.logOutAll(refreshToken, res);
    }
}