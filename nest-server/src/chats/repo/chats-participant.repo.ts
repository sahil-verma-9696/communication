import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import {
  ChatParticipant,
  ChatParticipantDocument,
  PARTICIPANT_ROLE,
} from '../schema/chat-participants.schema';
import { CreateChatParticipant } from '../types';

@Injectable()
export class ChatParticipantRepo {
  constructor(
    @InjectModel(ChatParticipant.name)
    private readonly model: Model<ChatParticipantDocument>,
  ) {}
  /********************************************************************
   ***************************** CREATE *******************************
   ********************************************************************/
  create(payload: CreateChatParticipant) {
    return handleMongoDbErrors(() =>
      this.model.create({
        user: new Types.ObjectId(payload.userId),
        chat: new Types.ObjectId(payload.chatId),
        role: payload.role,
      }),
    );
  }

  createParticipants(
    chatId: string | Types.ObjectId,
    participants: string[] | Types.ObjectId[],
  ) {
    return handleMongoDbErrors(() =>
      this.model.insertMany(
        participants.map((userId: string | Types.ObjectId) => ({
          user: new Types.ObjectId(userId),
          chat: new Types.ObjectId(chatId),
          role: PARTICIPANT_ROLE.MEMBER,
        })),
      ),
    );
  }

  /********************************************************************
   ***************************** READ *********************************
   ********************************************************************/
  getUserChats(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model.find({ creator: new Types.ObjectId(userId) }).exec(),
    );
  }
  /********************************************************************
   ***************************** UPDATE *******************************
   ********************************************************************/
  /********************************************************************
   ***************************** DELETE *******************************
   ********************************************************************/
}
