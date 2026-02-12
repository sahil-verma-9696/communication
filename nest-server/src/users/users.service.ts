import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from './dto/register-user';
import { UsersRepo } from './repos/users.repo';
import { AccountRepo } from './repos/account.repo';
import { AccountLifecycleRepo } from './repos/account_lifecycle.repo';
import { FriendRequestRepo } from 'src/friendrequest/repos/friendrequest.repo';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersRepo: UsersRepo,
    private accountsRepo: AccountRepo,
    private accountLifecycleRepo: AccountLifecycleRepo,
    private friendRequestRepo: FriendRequestRepo,
  ) {}

  async registerNewUser(user: RegisterUserDto) {
    const { name, email, password, avatar, isEmailVerified } = user;

    const newUser = await this.usersRepo.createUser({ name, email, avatar });

    if (!newUser) return null;

    const account = (
      await this.accountsRepo.create({
        user: newUser._id,
        passwordHash: password,
        isEmailVerified: !!isEmailVerified,
      })
    ).toJSON();

    if (!account) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...restAccount } = account;

    const accountLifecycle = !isEmailVerified
      ? await this.accountLifecycleRepo.create({ account: account._id })
      : null;

    return {
      userId: newUser._id,
      userAccountId: account._id,
      user: newUser.toJSON(),
      account: restAccount,
      accountLifecycle,
    };
  }

  async getUserProfile(
    currUserId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ) {
    const user = await this.usersRepo.findUserById(userId);

    if (!user) return null;

    const userAccount = await this.accountsRepo.findByUserId(userId);

    if (!userAccount) return null;

    const accountLifecycle = !userAccount.isEmailVerified
      ? await this.accountLifecycleRepo.findByAccountId(userAccount._id)
      : null;

    const friendReq =
      await this.friendRequestRepo.getFriendRequestBetweenUsersRaw(
        currUserId,
        userId,
      );

    return {
      user,
      account: userAccount,
      accountLifecycle,
      friendRequest: friendReq,
    };
  }

  findOne(id: string) {
    return this.usersRepo.findUserById(id);
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

  getAllUsers() {
    return this.usersRepo.findAllUsers();
  }
}
