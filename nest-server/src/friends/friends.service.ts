import { Injectable } from '@nestjs/common';
// import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from './schema/friends.schema';
import { Model, Types } from 'mongoose';

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

  async findAll(userId: string) {
    const objectId = new Types.ObjectId(userId);

    const relations = await this.friendModel
      .find({
        $or: [{ user: objectId }, { friend: objectId }],
      })
      .populate('user friend');

    // Step 2: Normalize result
    return relations.map((rel) => {
      return rel.user._id.equals(objectId) ? rel.friend : rel.user;
    });
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
