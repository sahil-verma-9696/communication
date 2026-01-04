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
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import * as authGuard from 'src/auth/auth.guard';
import { ChatType } from './schema/chat.schema';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Body()
    body: {
      chatType: ChatType;
      participants: string[];
      name?: string;
      description?: string;
    },
    @Request() req: authGuard.AuthRequest,
  ) {
    switch (body.chatType) {
      case ChatType.DIRECT:
        if (body.participants.length !== 1) {
          return null;
        }

        return this.chatsService.createDirectChat(
          req.user.sub,
          body.participants[0],
        );
      case ChatType.GROUP:
        return this.chatsService.createGroupChat(
          req.user.sub,
          body.name,
          body.description,
          body.participants,
        );
    }
  }

  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(@Request() req: authGuard.AuthRequest) {
    const userId = req.user.sub;
    return this.chatsService.getMyChats(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    const { name, description } = body;

    if (!name && !description) {
      return null;
    }

    const chat = await this.chatsService.findOne(id);

    if (chat?.type === ChatType.DIRECT) {
      return this.chatsService.updateName(id, name!);
    } else if (chat?.type === ChatType.GROUP) {
      return this.chatsService.updateGroupInfo(id, description!, name!);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
