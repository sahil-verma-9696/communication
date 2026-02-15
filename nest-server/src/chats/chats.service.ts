import { Injectable } from '@nestjs/common';
import { ChatRepo } from './repo/chats.repo';
import { ChatParticipantRepo } from './repo/chats-participant.repo';
import { PARTICIPANT_ROLE } from './schema/chat-participants.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/EVENTS';
import type { FriendRequestDocument } from 'src/friendrequest/schema/friendrequests.schema';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private chatParticipantRepo: ChatParticipantRepo,
    private chatRepo: ChatRepo,
  ) {}

  @OnEvent(EVENTS.FRIEND_REQUEST.ACCEPTED, { async: true })
  async createDirectChat(friendReq: FriendRequestDocument) {
    const chat = await this.chatRepo.createDirectChat(friendReq.sender);

    await this.chatParticipantRepo.create({
      chatId: chat._id,
      userId: friendReq.sender,
      role: PARTICIPANT_ROLE.OWNER,
    });

    await this.chatParticipantRepo.create({
      chatId: chat._id,
      userId: friendReq.receiver,
      role: PARTICIPANT_ROLE.MEMBER,
    });

    return chat;
  }

  async createGroupChat(userId: string, payload: CreateChatDto) {
    const chat = await this.chatRepo.createGroupChat({
      name: payload.name,
      creator: userId,
      description: payload.description,
      avatar: payload.avatar,
    });

    await this.chatParticipantRepo.create({
      chatId: chat._id,
      userId,
      role: PARTICIPANT_ROLE.OWNER,
    });

    await this.chatParticipantRepo.createParticipants(
      chat._id,
      payload.participants,
    );
  }

  async getDirectChatByParticipant(userId: string, participant: string) {
    const result = await this.chatRepo.getDirectChatByParticipant(
      userId,
      participant,
    );
    return result;
  }
}
