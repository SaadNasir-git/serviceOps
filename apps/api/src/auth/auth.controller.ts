import { Body, Controller, Cookies, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {

    }

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.AuthService.createUser(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.login(loginDto, res);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Cookies('uniqueId') cookie: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.AuthService.verifyEmail(token, cookie, res);
    }

    @Post('verify-otp')
    async verifyOtp() {

    }
}