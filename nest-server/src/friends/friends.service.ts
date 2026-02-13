import { Injectable } from '@nestjs/common';
// import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from './schema/friends.schema';
import { Model, Types } from 'mongoose';
import { FriendListItem } from './types';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/EVENTS';
import type { FriendRequestDocument } from 'src/friendrequest/schema/friendrequests.schema';
import { FriendsRepo } from './repo/friends.repo';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
    private repo: FriendsRepo,
  ) {}

  @OnEvent(EVENTS.FRIEND_REQUEST.ACCEPTED, { async: true })
  private async create(request: FriendRequestDocument) {
    await this.repo.create({
      user: request.sender,
      friend: request.receiver,
    });
  }

  async getAllUserFriends(userId: string) {
    const currentUserId = new Types.ObjectId(userId);

    return this.friendModel.aggregate<FriendListItem[]>([
      /* 1️⃣ Only relations involving me */
      {
        $match: {
          $or: [{ user: currentUserId }, { friend: currentUserId }],
        },
      },

      /* 2️⃣ Normalize friend user */
      {
        $addFields: {
          friendUserId: {
            $cond: [{ $eq: ['$user', currentUserId] }, '$friend', '$user'],
          },
        },
      },

      /* 3️⃣ Join friend user details */
      {
        $lookup: {
          from: 'users',
          localField: 'friendUserId',
          foreignField: '_id',
          as: 'friend',
        },
      },
      { $unwind: '$friend' },

      /* 4️⃣ 🔥 Lookup direct chat */
      {
        $lookup: {
          from: 'chatparticipants',
          let: { friendId: '$friend._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$user', [currentUserId, '$$friendId']],
                },
              },
            },
            {
              $group: {
                _id: '$chat',
                users: { $addToSet: '$user' },
              },
            },
            {
              $match: {
                $expr: { $eq: [{ $size: '$users' }, 2] },
              },
            },
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
                'chat.type': 'direct',
                'chat.isDeleted': false,
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: 'directChat',
        },
      },

      /* 5️⃣ Shape response */
      {
        $project: {
          _id: '$friend._id',
          name: '$friend.name',
          email: '$friend.email',
          avatar: '$friend.avatar',
          directChatId: {
            $cond: [
              { $gt: [{ $size: '$directChat' }, 0] },
              { $arrayElemAt: ['$directChat._id', 0] },
              null,
            ],
          },
        },
      },
    ]);
  }

  blockFriendship(id: string, userId: string) {
    return this.repo.updateBlockByUserRaw(userId, id, true);
  }

  async remove(id: string) {
    const ObjectId = new Types.ObjectId(id);
    const friend = await this.friendModel.findByIdAndDelete(ObjectId);

    if (!friend) {
      throw new Error('Friend not found');
    }

    return friend;
  }
}
