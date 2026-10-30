import { Body, Controller, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { UpdateProfileDto } from './dto/updateProfile.dto.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Patch(':id')
    @UseGuards(AuthGuard('admin', 'customer'))
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Param('id') userId: string) {
        return this.userService.updateUser(userId, updateProfileDto);
    }
}