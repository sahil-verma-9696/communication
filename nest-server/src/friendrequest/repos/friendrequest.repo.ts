import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  FriendRequest,
  FriendRequestDocument,
  FriendRequestStatus,
} from '../schema/friendrequests.schema';

import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import {
  CreateFriendRequest,
  FriendRequestPopulated,
  UserFriendRequest,
  UserFriendRequestPopulated,
} from '../types';

@Injectable()
export class FriendRequestRepo {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly model: Model<FriendRequestDocument>,
  ) {}

  /********************************************************************
   ******************************* CREATE *****************************
   ********************************************************************/

  create(payload: CreateFriendRequest) {
    return handleMongoDbErrors(() => this.model.create(payload));
  }

  /********************************************************************
   ******************************* READ *******************************
   ********************************************************************/

  getByIdRaw(id: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model.findById(new Types.ObjectId(id)),
    );
  }
  getByIdPopulated(id: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model
        .findById(id)
        .populate('sender')
        .populate('receiver')
        .lean<FriendRequestPopulated>(),
    );
  }

  getBySenderRaw(userId: string | Types.ObjectId) {
    return this.model.find({ sender: new Types.ObjectId(userId) });
  }

  getByReceiverRaw(userId: string | Types.ObjectId) {
    return this.model.find({ receiver: new Types.ObjectId(userId) });
  }

  getByUserPopulated(userId: string | Types.ObjectId) {
    const uid = new Types.ObjectId(userId);

    return this.model
      .find({
        $or: [{ sender: uid }, { receiver: uid }],
      })
      .sort({ createdAt: -1 })
      .populate('sender')
      .populate('receiver')
      .lean<FriendRequestPopulated[]>();
  }

  getFriendRequestByUserIdRaw(userId: string | Types.ObjectId) {
    const uid = new Types.ObjectId(userId);

    return handleMongoDbErrors(() =>
      this.model
        .aggregate<UserFriendRequest>([
          {
            $match: {
              $or: [{ sender: uid }, { receiver: uid }],
            },
          },

          {
            $facet: {
              // Requests I SENT
              sendTo: [
                { $match: { sender: uid } },
                {
                  $project: {
                    _id: 0,
                    requestId: '$_id',
                    to: '$receiver',
                  },
                },
              ],

              // Requests I RECEIVED
              receiveFrom: [
                { $match: { receiver: uid } },
                {
                  $project: {
                    _id: 0,
                    requestId: '$_id',
                    from: '$sender',
                  },
                },
              ],
            },
          },
        ])
        .then((res) => res[0] ?? { sendTo: [], receiveFrom: [] }),
    );
  }

  getFriendRequestByUserIdPopulated(userId: string | Types.ObjectId) {
    const uid = new Types.ObjectId(userId);

    return handleMongoDbErrors(() =>
      this.model
        .aggregate<UserFriendRequestPopulated>([
          {
            $match: {
              $or: [{ sender: uid }, { receiver: uid }],
            },
          },

          {
            $facet: {
              // ---------------- SENT REQUESTS ----------------
              sendTo: [
                { $match: { sender: uid } },

                {
                  $lookup: {
                    from: 'users',
                    localField: 'receiver',
                    foreignField: '_id',
                    as: 'to',
                  },
                },

                { $unwind: '$to' },

                {
                  $project: {
                    _id: 0,
                    requestId: '$_id',
                    to: {
                      _id: '$to._id',
                      name: '$to.name',
                      email: '$to.email',
                      avatar: '$to.avatar',
                      createdAt: '$to.createdAt',
                      updatedAt: '$to.updatedAt',
                    },
                  },
                },
              ],

              // ---------------- RECEIVED REQUESTS ----------------
              receiveFrom: [
                { $match: { receiver: uid } },

                {
                  $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'from',
                  },
                },

                { $unwind: '$from' },

                {
                  $project: {
                    _id: 0,
                    requestId: '$_id',
                    from: {
                      _id: '$from._id',
                      name: '$from.name',
                      email: '$from.email',
                      avatar: '$from.avatar',
                      createdAt: '$from.createdAt',
                      updatedAt: '$from.updatedAt',
                    },
                  },
                },
              ],
            },
          },
        ])
        .then((res) => res[0] ?? { sendTo: [], receiveFrom: [] }),
    );
  }

  /********************************************************************
   ******************************* UPDATE *****************************
   ********************************************************************/

  updateStatusRaw(id: string | Types.ObjectId, status: FriendRequestStatus) {
    return handleMongoDbErrors(() =>
      this.model.findByIdAndUpdate(id, { status }, { new: true }),
    );
  }
  updateStatusPopulated(
    id: string | Types.ObjectId,
    status: FriendRequestStatus,
  ) {
    return handleMongoDbErrors(() =>
      this.model
        .findByIdAndUpdate(id, { status }, { new: true })
        .populate('sender')
        .populate('receiver')
        .lean<FriendRequestPopulated>(),
    );
  }

  /********************************************************************
   ******************************* DELETE *****************************
   ********************************************************************/

  deleteById(id: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.model.deleteOne({ _id: new Types.ObjectId(id) }),
    );
  }
}
