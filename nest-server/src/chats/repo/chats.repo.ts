import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, CHAT_TYPE, ChatDocument } from '../schema/chat.schema';
import { Model, Types } from 'mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import { CreateGroupChat, GetChatBetweenUsers } from '../types';

@Injectable()
export class ChatRepo {
  constructor(
    @InjectModel(Chat.name) private readonly model: Model<ChatDocument>,
  ) {}
  /********************************************************************
   ***************************** CREATE *******************************
   ********************************************************************/
  createDirectChat(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model.create({
        creator: new Types.ObjectId(userId),
        type: CHAT_TYPE.DIRECT,
      }),
    );
  }

  createGroupChat(payload: CreateGroupChat) {
    return handleMongoDbErrors(() =>
      this.model.create({
        ...payload,
        creator: new Types.ObjectId(payload.creator),
        type: CHAT_TYPE.GROUP,
      }),
    );
  }
  /********************************************************************
   ***************************** READ *********************************
   ********************************************************************/
  getUserChats(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .aggregate<ChatDocument>([
          {
            $lookup: {
              from: 'chatParticipants',
              localField: '_id',
              foreignField: 'chat',
              as: 'participants',
            },
          },
          {
            $match: {
              $or: [
                { createdBy: new Types.ObjectId(userId) },
                { 'participants.user': new Types.ObjectId(userId) },
              ],
            },
          },
        ])
        .exec(),
    );
  }

  getChatBetweenUsers(
    userIdA: string | Types.ObjectId,
    userIdB: string | Types.ObjectId,
    chatType: CHAT_TYPE,
  ) {
    return handleMongoDbErrors(() =>
      this.model
        .aggregate<ChatDocument>([
          {
            $lookup: {
              from: 'chatParticipants',
              localField: '_id',
              foreignField: 'chat',
              as: 'participants',
            },
          },
          {
            $match: {
              $and: [
                { type: chatType },
                {
                  'participants.user': {
                    $in: [
                      new Types.ObjectId(userIdA),
                      new Types.ObjectId(userIdB),
                    ],
                  },
                },
              ],
            },
          },
        ])
        .exec(),
    );
  }

  getDirectChatByParticipant(
    userId: string | Types.ObjectId,
    participant: string | Types.ObjectId,
  ) {
    const me = new Types.ObjectId(userId);
    const other = new Types.ObjectId(participant);

    console.log(me, other);
    return handleMongoDbErrors(() =>
      this.model
        .aggregate<GetChatBetweenUsers>([
          {
            $lookup: {
              from: 'chatparticipants',
              localField: '_id',
              foreignField: 'chat',
              as: 'participants',
            },
          },

          {
            $match: {
              type: 'direct',
              participants: {
                $elemMatch: { user: me },
              },
              $expr: {
                $eq: [{ $size: '$participants' }, 2],
              },
            },
          },

          // extract OTHER participant (full doc)
          {
            $addFields: {
              participant: {
                $first: {
                  $filter: {
                    input: '$participants',
                    as: 'p',
                    cond: {
                      $ne: ['$$p.user', me],
                    },
                  },
                },
              },
            },
          },

          // populate user inside participant
          {
            $lookup: {
              from: 'users',
              localField: 'participant.user',
              foreignField: '_id',
              as: 'participant.user',
            },
          },

          {
            $set: {
              'participant.user': { $first: '$participant.user' },
            },
          },

          // clean output
          {
            $project: {
              participants: 0,
            },
          },

          {
            $project: {
              chat: {
                _id: '$_id',
                type: '$type',
                name: '$name',
                description: '$description',
                avatar: '$avatar',
                lastMessage: '$lastMessage',
                creator: '$creator',
                unreadCount: '$unreadCount',
                isArchived: '$isArchived',
                isDeleted: '$isDeleted',
                createdAt: '$createdAt',
                updatedAt: '$updatedAt',
              },
              participant: '$participant',
            },
          },
        ])
        .exec(),
    );
  }
  /********************************************************************
   ***************************** UPDATE *******************************
   ********************************************************************/
  /********************************************************************
   ***************************** DELETE *******************************
   ********************************************************************/
}
