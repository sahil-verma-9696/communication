import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from '../schema/friends.schema';
import { Model, Types } from 'mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import { CreateFriend } from '../types';

@Injectable()
export class FriendsRepo {
  constructor(
    @InjectModel(Friend.name) private readonly model: Model<FriendDocument>,
  ) {}

  /********************************************************************
   ***************************** CREATE *******************************
   ********************************************************************/

  create(friend: CreateFriend) {
    return handleMongoDbErrors(() =>
      this.model.create({
        ...friend,
        user: new Types.ObjectId(friend.user),
        friend: new Types.ObjectId(friend.friend),
      }),
    );
  }

  /********************************************************************
   ***************************** READ *********************************
   ********************************************************************/

  getUserFriendsRaw(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .find({
          $or: [
            { user: new Types.ObjectId(userId) },
            { friend: new Types.ObjectId(userId) },
          ],
          isBlocked: false,
        })
        .exec(),
    );
  }
  getUserFriendsPopulated(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .find({
          $or: [
            { user: new Types.ObjectId(userId) },
            { friend: new Types.ObjectId(userId) },
          ],
          isBlocked: false,
        })
        .populate('friend user')
        .exec(),
    );
  }

  getUserBlockedFriendsRaw(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .find({
          $or: [
            { user: new Types.ObjectId(userId) },
            { friend: new Types.ObjectId(userId) },
          ],
          isBlocked: true,
        })
        .exec(),
    );
  }
  getUserBlockedFriendsPopulated(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .find({
          $or: [
            { user: new Types.ObjectId(userId) },
            { friend: new Types.ObjectId(userId) },
          ],
          isBlocked: true,
        })
        .populate('user friend')
        .exec(),
    );
  }

  /********************************************************************
   ***************************** UPDATE *******************************
   ********************************************************************/
  updateBlockByUserRaw(
    blockBy: string | Types.ObjectId,
    id: string | Types.ObjectId,
    isBlocked: boolean,
  ) {
    return handleMongoDbErrors(() =>
      this.model
        .findOneAndUpdate(
          {
            _id: new Types.ObjectId(id),
            friend: new Types.ObjectId(blockBy),
          },
          { isBlocked: isBlocked, blockedBy: new Types.ObjectId(blockBy) },
          { new: true },
        )
        .exec(),
    );
  }
  /********************************************************************
   ***************************** DELETE *******************************
   ********************************************************************/
}
