import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import * as authGuard from 'src/auth/auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Request() req: authGuard.AuthRequest,
    @Body() body: { friendId: string },
  ) {
    const userId = req.user.sub;
    const friendId = body.friendId;

    return this.friendsService.create(userId, friendId);
  }

  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.friendsService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
  //   return this.friendsService.update(+id, updateFriendDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendsService.remove(id);
  }
}
