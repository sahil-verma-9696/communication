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
  async createDirectChat(userId: string, participantId: string) {
    const userA = new Types.ObjectId(userId);
    const userB = new Types.ObjectId(participantId);

    /**
     * 1️⃣ Check if DIRECT chat already exists between both users
     */
    const existingChat = await this.chatParticipantModel.aggregate<{
      _id: Types.ObjectId;
      count: number;
      chat: Chat;
    }>([
      {
        $match: {
          user: { $in: [userA, userB] },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$chat',
          count: { $sum: 1 },
        },
      },
      { $match: { count: 2 } },
      {
        $lookup: {
          from: 'chats',
          localField: '_id',
          foreignField: '_id',
          as: 'chat',
        },
      },
      { $unwind: '$chat' },
      {
        $match: {
          'chat.type': ChatType.DIRECT,
          'chat.isDeleted': false,
        },
      },
      { $limit: 1 },
    ]);

    if (existingChat.length > 0) {
      return existingChat[0].chat; // ✅ return already existing chat
    }

    /**
     * 2️⃣ Create new DIRECT chat
     */
    const newChat = await this.chatModel.create({
      type: ChatType.DIRECT,
    });

    /**
     * 3️⃣ Create participants (bulk insert)
     */
    await this.chatParticipantModel.insertMany([
      {
        chat: newChat._id,
        user: userA,
        role: ChatParticipantRole.PARTICIPANT,
      },
      {
        chat: newChat._id,
        user: userB,
        role: ChatParticipantRole.PARTICIPANT,
      },
    ]);

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
      name: name || 'Un_named',
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
    const currentUserId = new Types.ObjectId(userId);

    return this.chatParticipantModel.aggregate([
      /* 1️⃣ My participation */
      {
        $match: {
          user: currentUserId,
          isDeleted: false,
        },
      },

      /* 2️⃣ Join chat */
      {
        $lookup: {
          from: 'chats',
          localField: 'chat',
          foreignField: '_id',
          as: 'chat',
        },
      },

      /* 3️⃣ Flatten */
      { $unwind: '$chat' },

      /* 4️⃣ Ignore deleted chats */
      {
        $match: {
          'chat.isDeleted': false,
        },
      },

      /* 5️⃣ 🔥 Lookup other participant (DIRECT only) */
      {
        $lookup: {
          from: 'chatparticipants',
          let: { chatId: '$chat._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$chat', '$$chatId'] },
                    { $ne: ['$user', currentUserId] },
                    { $eq: ['$isDeleted', false] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: '$user' },
            {
              $project: {
                _id: 0,
                user: {
                  _id: '$user._id',
                  name: '$user.name',
                  email: '$user.email',
                },
              },
            },
          ],
          as: 'directParticipant',
        },
      },

      /* 6️⃣ Shape response */
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

          participant: {
            $cond: [
              { $eq: ['$chat.type', 'direct'] },
              { $arrayElemAt: ['$directParticipant.user', 0] },
              null,
            ],
          },
        },
      },

      /* 7️⃣ Sort */
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

  findOne(id: string) {
    return this.chatModel.findById(new Types.ObjectId(id));
  }

  updateName(id: string, name: string) {
    return this.chatModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { name: name },
    );
  }

  updateGroupInfo(id: string, description: string, name: string) {
    return this.chatModel.updateOne(
      { _id: new Types.ObjectId(id), type: ChatType.GROUP },
      { description: description, name: name },
    );
  }

  remove(id: string) {
    this.chatModel.updateOne({ _id: id }, { isDeleted: true });
    return `This action removes a #${id} chat`;
  }
}
