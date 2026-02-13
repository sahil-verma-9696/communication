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
import { FriendRequestStatus } from './schema/friendrequests.schema';

@Controller('friendrequests')
export class FriendRequestController {
  constructor(private readonly friendrequestService: FriendRequestsService) {}

  /********************************************************************
   ******************************* CREATE *****************************
   ********************************************************************/
  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Query('friendId') friendId: string,
    @Request() req: authGuard.AuthRequest,
  ) {
    const userId = req.user.sub;
    return this.friendrequestService.sendRequest(userId, friendId);
  }

  /********************************************************************
   ******************************* READ *******************************
   ********************************************************************/

  // TODO : to add flexibile queries
  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(
    @Request() req: authGuard.AuthRequest,
    @Query() query: { status?: FriendRequestStatus },
  ) {
    const userId = req.user.sub;
    // friendrequests?status=FriendRequestStatus :: get all friend requests of user with status
    if (query.status) {
      return this.friendrequestService.getUserFriendRequestsByStatus(
        userId,
        query.status,
      );
    }

    // friendrequests :: get all friend requests comming to user
    return this.friendrequestService.getReceivedFriendRequests(userId);
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

  /********************************************************************
   ******************************* UPDATE *****************************
   ********************************************************************/

  @UseGuards(authGuard.AuthGuard)
  @Patch(':id')
  update(
    @Param('id') requestId: string,
    @Query('status') status: FriendRequestStatus,
    @Request() req: authGuard.AuthRequest,
  ) {
    // check if action query param is present
    if (!status) {
      throw new BadRequestException('Action query param is required');
    }
    const userId = req.user.sub;

    return this.friendrequestService.updateRequestStatus(
      requestId,
      userId,
      status,
    );
  }

  /********************************************************************
   ******************************* DELETE *****************************
   ********************************************************************/

  @UseGuards(authGuard.AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.friendrequestService.remove(id, userId);
  }
}
