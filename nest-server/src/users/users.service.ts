import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const payload: User = {
      passwordHash: createUserDto.password,
      ...createUserDto,
    };
    const newUser = await this.userModel.create(payload);

    if (!newUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this.findOne(newUser._id.toString());

    return user;
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
      // 1️⃣ Text matching
      {
        $match: {
          $or: [{ name: contains }, { email: contains }],
          _id: { $ne: currentUserObjectId }, // exclude self
        },
      },

      // 2️⃣ Lookup friendship
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

      // 3️⃣ Compute isFriend
      {
        $addFields: {
          isFriend: { $gt: [{ $size: '$friendRelation' }, 0] },
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

      // 4️⃣ Sorting
      {
        $sort: {
          relevance: -1,
          name: 1,
        },
      },

      // 5️⃣ Cleanup
      {
        $project: {
          passwordHash: 0,
          relevance: 0,
          friendRelation: 0,
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

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email })
      .select('-passwordHash');

    if (!user) {
      throw new NotFoundException('User not found');
    }
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
