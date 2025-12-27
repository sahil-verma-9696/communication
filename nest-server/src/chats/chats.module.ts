import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatParticipant,
  ChatParticipantSchema,
} from './schema/chat-participants.schema';
import { Chat, ChatSchema } from './schema/chat.schema';
import { Group, GroupSchema } from './schema/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatParticipant.name, schema: ChatParticipantSchema },
    ]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
