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
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import * as authGuard from 'src/auth/auth.guard';
import { MessageType } from './schema/messages.schema';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(authGuard.AuthGuard)
  @Post()
  create(
    @Body() body: { text: string; chatId: string; type: MessageType },
    @Request() req: authGuard.AuthRequest,
  ) {
    const senderId = req.user.sub;

    return this.messagesService.create(
      body.chatId,
      senderId,
      body.type,
      body.text,
    );
  }

  @UseGuards(authGuard.AuthGuard)
  @Get()
  findAll(@Query() query: { chatId: string }) {
    const chatId = query.chatId;
    return this.messagesService.findAll(chatId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: any) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
