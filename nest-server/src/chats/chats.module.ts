import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatParticipant,
  ChatParticipantSchema,
} from './schema/chat-participants.schema';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ChatRepo } from './repo/chats.repo';
import { ChatParticipantRepo } from './repo/chats-participant.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatParticipant.name, schema: ChatParticipantSchema },
    ]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatRepo, ChatParticipantRepo],
})
export class ChatsModule {}
