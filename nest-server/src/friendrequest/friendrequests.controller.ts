import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import * as authGuard from 'src/auth/auth.guard';
import { FriendRequestsService } from './friendrequests.service';
import { FriendRequestType } from './schema/friendrequests.schema';

export enum FriendRequestAction {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Controller('friendrequests')
export class FriendRequestController {
  constructor(private readonly friendrequestService: FriendRequestsService) {}

  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Query() q: { friendId: string },
    @Request() req: authGuard.AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.friendrequestService.sendRequest(userId, q.friendId);
  }

  // TODO : to add flexibile queries
  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(
    @Request() req: authGuard.AuthRequest,
    @Query() query: { type: FriendRequestType },
  ) {
    if (query.type === FriendRequestType.RECEIVE) {
      return this.friendrequestService.getReceivedFriendRequests(req.user.sub);
    }

    if (query.type === FriendRequestType.SEND) {
      return this.friendrequestService.getSentFriendRequests(req.user.sub);
    }
    return this.friendrequestService.findAll(req.user.sub);
  }

  @UseGuards(authGuard.AuthGuard)
  @Get(':id')
  findOne(
    @Param('id') requestId: string,
    @Request() req: authGuard.AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.friendrequestService.findOne(userId, requestId);
  }

  @UseGuards(authGuard.AuthGuard)
  @Patch(':id')
  update(
    @Param('id') requestId: string,
    @Query('action') action: FriendRequestAction,
    @Request() req: authGuard.AuthRequest,
  ) {
    // check if action query param is present
    if (!action) {
      throw new BadRequestException('Action query param is required');
    }

    // check if action is valid
    if (
      action !== FriendRequestAction.ACCEPT &&
      action !== FriendRequestAction.REJECT
    ) {
      throw new BadRequestException('Invalid action');
    }
    const userId = req.user.sub;

    switch (action) {
      case FriendRequestAction.ACCEPT:
        return this.friendrequestService.acceptRequest(userId, requestId);
      case FriendRequestAction.REJECT:
        return this.friendrequestService.rejectRequest(userId, requestId);
      default:
        throw new BadRequestException('Invalid action');
    }
  }

  // TODO : to implement
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendrequestService.remove(+id);
  }
}
