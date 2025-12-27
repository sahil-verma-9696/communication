import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ChatParticipant,
  ChatParticipantDocument,
  ChatParticipantRole,
} from './schema/chat-participants.schema';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, ChatType } from './schema/chat.schema';
import { Group, GroupDocument } from './schema/group.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatParticipant.name)
    private chatParticipantModel: Model<ChatParticipantDocument>,

    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  /**
   * createDirectChat
   * ------------------
   *
   * 1. create chat
   * 2. create chat owner
   * 3. create chat participant
   *
   * @param ownerId
   * @param participantId
   * @returns Promise<Chat>
   */
  async createDirectChat(ownerId: string, participantId: string) {
    const newChat = await this.chatModel.create({
      type: ChatType.DIRECT,
    });

    await this.chatParticipantModel.create({
      chat: newChat._id,
      user: new Types.ObjectId(ownerId),
      role: ChatParticipantRole.OWNER,
    });

    await this.chatParticipantModel.create({
      chat: newChat._id,
      user: new Types.ObjectId(participantId),
      role: ChatParticipantRole.PARTICIPANT,
    });

    return newChat;
  }

  /**
   * createGroupChat
   * ------------------
   *
   * 1. create chat
   * 2. create group
   * 3. create chat owner
   * 4. create chat participants
   *
   * @param ownerId
   * @param name
   * @param description
   * @param participants
   * @returns Promise<Chat>
   */
  async createGroupChat(
    ownerId: string,
    name: string | undefined,
    description: string | undefined,
    participants: string[],
  ) {
    const newChat = await this.chatModel.create({
      type: ChatType.GROUP,
      name: name || 'There is no name',
      description: description || 'There is no description',
    });

    await this.groupModel.create({ chat: newChat._id });

    await this.chatParticipantModel.create({
      chat: newChat._id,
      user: new Types.ObjectId(ownerId),
      role: ChatParticipantRole.OWNER,
    });

    const chatParticipants = participants.map((participant) => ({
      chat: newChat._id,
      user: new Types.ObjectId(participant),
      role: ChatParticipantRole.PARTICIPANT,
    }));

    await this.chatParticipantModel.insertMany(chatParticipants);

    return newChat;
  }

  /**
   * getMyChats
   * ------------------
   *
   * 1️⃣ Only my participation rows
   * 2️⃣ Join with chats
   * 3️⃣ Flatten chat array
   * 4️⃣ Ignore deleted chats
   * 5️⃣ Shape response
   *
   * @param userId
   * @returns
   */
  getMyChats(userId: string) {
    return this.chatParticipantModel.aggregate([
      // 1️⃣ Only my participation rows
      {
        $match: {
          user: new Types.ObjectId(userId),
          isDeleted: false,
        },
      },

      // 2️⃣ Join with chats
      {
        $lookup: {
          from: 'chats',
          localField: 'chat',
          foreignField: '_id',
          as: 'chat',
        },
      },

      // 3️⃣ Flatten chat array
      { $unwind: '$chat' },

      // 4️⃣ Ignore deleted chats
      {
        $match: {
          'chat.isDeleted': false,
        },
      },

      // 5️⃣ Shape response
      {
        $project: {
          _id: 0,
          chatId: '$chat._id',
          type: '$chat.type',
          name: '$chat.name',
          description: '$chat.description',
          lastMessage: '$chat.lastMessage',
          isArchived: '$chat.isArchived',

          role: '$role',
          unreadCount: '$unreadCount',
          joinedAt: '$createdAt',
        },
      },

      // 6️⃣ Optional: latest active chats first
      {
        $sort: {
          joinedAt: -1,
        },
      },
    ]);
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
