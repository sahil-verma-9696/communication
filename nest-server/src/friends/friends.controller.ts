import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import * as authGuard from 'src/auth/auth.guard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(authGuard.AuthGuard)
  @Get()
  getAllUserFriends(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.friendsService.getAllUserFriends(userId);
  }

  @UseGuards(authGuard.AuthGuard)
  @Patch(':id')
  patchBlockFriendship(
    @Param('id') id: string,
    @Request() req: authGuard.AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.friendsService.blockFriendship(id, userId);
  }
}
