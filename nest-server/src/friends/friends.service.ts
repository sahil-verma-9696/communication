import { Injectable } from '@nestjs/common';
// import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from './schema/friends.schema';
import { Model, Types } from 'mongoose';
import { FriendListItem } from './types';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
  ) {}

  async create(userId: string, friendId: string) {
    const friend = await this.friendModel.create({
      user: new Types.ObjectId(userId),
      friend: new Types.ObjectId(friendId),
    });

    if (!friend) {
      throw new Error('Failed to create friend');
    }

    return friend;
  }

  async findAll(userId: string): Promise<FriendListItem[]> {
    const currentUserId = new Types.ObjectId(userId);

    return this.friendModel.aggregate([
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

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  // update(id: number, updateFriendDto: UpdateFriendDto) {
  //   return `This action updates a #${id} ${updateFriendDto.toString()} friend`;
  // }

  async remove(id: string) {
    const ObjectId = new Types.ObjectId(id);
    const friend = await this.friendModel.findByIdAndDelete(ObjectId);

    if (!friend) {
      throw new Error('Friend not found');
    }

    return friend;
  }
}
