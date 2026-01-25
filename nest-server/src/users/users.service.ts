import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserWithoutPassword } from './schema/users.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  /**
   * Create User
   * --------------
   *
   * @description Create user if not then return null.
   * @param { User } payload
   * @returns
   */
  async create(payload: User): Promise<UserWithoutPassword | null> {
    const user = await this.userModel.create(payload);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      verified_email: user.verified_email,
    };
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findById(ObjectId)
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * search users
   * ------------
   * query user by name or email, case insensitive
   * @param q
   * @returns Promise<User[]>
   */
  async searchUsers(q: string, currentUserId: string) {
    if (!q?.trim()) return [];

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWith = new RegExp(`^${escaped}`, 'i');
    const contains = new RegExp(escaped, 'i');

    const currentUserObjectId = new Types.ObjectId(currentUserId);

    return this.userModel.aggregate([
      /* 1️⃣ Match users */
      {
        $match: {
          $or: [{ name: contains }, { email: contains }],
          _id: { $ne: currentUserObjectId },
        },
      },

      /* 2️⃣ Friendship lookup */
      {
        $lookup: {
          from: 'friends',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ['$user', currentUserObjectId] },
                        { $eq: ['$friend', '$$userId'] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ['$friend', currentUserObjectId] },
                        { $eq: ['$user', '$$userId'] },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'friendRelation',
        },
      },

      /* 3️⃣ 🔥 Direct chat lookup */
      {
        $lookup: {
          from: 'chatparticipants',
          let: { otherUserId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$user', [currentUserObjectId, '$$otherUserId']],
                },
              },
            },
            {
              $group: {
                _id: '$chat',
                participants: { $addToSet: '$user' },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: [{ $size: '$participants' }, 2], // both users present
                },
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

      /* 4️⃣ Compute fields */
      {
        $addFields: {
          isFriend: { $gt: [{ $size: '$friendRelation' }, 0] },
          directChatId: {
            $cond: [
              { $gt: [{ $size: '$directChat' }, 0] },
              { $arrayElemAt: ['$directChat._id', 0] },
              null,
            ],
          },
          relevance: {
            $switch: {
              branches: [
                {
                  case: { $regexMatch: { input: '$name', regex: startsWith } },
                  then: 4,
                },
                {
                  case: { $regexMatch: { input: '$email', regex: startsWith } },
                  then: 3,
                },
                {
                  case: { $regexMatch: { input: '$name', regex: contains } },
                  then: 2,
                },
                {
                  case: { $regexMatch: { input: '$email', regex: contains } },
                  then: 1,
                },
              ],
              default: 0,
            },
          },
        },
      },

      /* 5️⃣ Sort */
      {
        $sort: {
          relevance: -1,
          name: 1,
        },
      },

      /* 6️⃣ Cleanup */
      {
        $project: {
          passwordHash: 0,
          relevance: 0,
          friendRelation: 0,
          directChat: 0,
        },
      },
    ]);
  }

  async verfiyPassword(id: string, password: string) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findById(ObjectId)
      .select('+passwordHash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await user.comparePassword(password);

    return isMatch;
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('-passwordHash');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const ObjectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findByIdAndUpdate(ObjectId, updateUserDto, { new: true })
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  remove(id: string) {
    const ObjectId = new Types.ObjectId(id);
    return this.userModel.findByIdAndDelete(ObjectId);
  }
}
