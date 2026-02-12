import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as authGuard from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(
    @Query() query: { q: string },
    @Request() req: authGuard.AuthRequest,
  ) {
    const { q } = query;
    const userId = req.user.sub;

    if (q) {
      return this.usersService.searchUsers(q, userId);
    }

    return this.usersService.getAllUsers();
  }

  @Get('all')
  findAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'it will be removed';
  }

  @UseGuards(authGuard.AuthGuard)
  @Get(':id/profile')
  getProfile(@Param('id') id: string, @Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.usersService.getUserProfile(userId, id);
  }
}
