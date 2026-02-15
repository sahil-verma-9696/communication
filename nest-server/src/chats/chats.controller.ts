import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import * as authGuard from 'src/auth/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Body() body: CreateChatDto | null,
    @Request() req: authGuard.AuthRequest,
  ) {
    const userId = req.user.sub;

    // chats
    if (!body) throw new NotAcceptableException('Body is required');

    return this.chatsService.createGroupChat(userId, body);
  }

  // chats?type=direct&participant=123
  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(
    @Request() req: authGuard.AuthRequest,
    @Query('participant') participant: string,
  ) {
    const userId = req.user.sub;
    return this.chatsService.getDirectChatByParticipant(userId, participant);
  }
}
