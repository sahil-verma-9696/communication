import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
  FriendRequestStatus,
} from './schema/friendrequests.schema';
import { FriendsService } from './../friends/friends.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/schema/notification.schema';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    private friendsService: FriendsService,
    private notificationService: NotificationService,
  ) {}

  /**
   * ❌ User cannot send request to self
   * ❌ If PENDING request exists → block
   * ❌ If ACCEPTED request exists → block (already friends)
   * ✅ If REJECTED request exists → allow re-send (set back to PENDING)
   * ✅ If no request exists → create new with PENDING
   * 🔐 Also prevent reverse pending requests (important)
   * @param userId
   * @param friendId
   * @returns Promise<FriendRequest>
   */
  async sendRequest(
    userId: string,
    friendId: string,
    senderName?: string,
    senderEmail?: string,
  ) {
    // ❌ Prevent self request
    if (userId === friendId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const sender = new Types.ObjectId(userId);
    const receiver = new Types.ObjectId(friendId);

    // 🔍 Check if any request exists between users (both directions)
    const existingRequest = await this.friendRequestModel.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    // ✅ If request exists, handle by status
    if (existingRequest) {
      // Already friends or pending
      if (
        existingRequest.status === FriendRequestStatus.PENDING ||
        existingRequest.status === FriendRequestStatus.ACCEPTED
      ) {
        throw new ConflictException('Friend request already exists');
      }

      // 🔁 Previously rejected → re-send
      if (existingRequest.status === FriendRequestStatus.REJECTED) {
        existingRequest.sender = sender;
        existingRequest.receiver = receiver;
        existingRequest.status = FriendRequestStatus.PENDING;

        await existingRequest.save();
        return existingRequest;
      }
    }

    // ✅ No request exists → create new
    const friendRequest = await this.friendRequestModel.create({
      sender,
      receiver,
      status: FriendRequestStatus.PENDING,
    });

    // 🔔 Send notification
    await this.notificationService.createNotification({
      userId: friendId,
      type: NotificationType.FRIEND_REQUEST,
      title: 'Friend request',
      message: `You have a new friend request from ${senderName} (${senderEmail})`,
      triggeredBy: userId,
    });

    return friendRequest;
  }

  /**
   * get all friend requests comming to user
   * @param userId
   * @returns Promise<FriendRequest[]>
   */
  findAll(userId: string) {
    return this.friendRequestModel
      .find({ receiver: new Types.ObjectId(userId) })
      .populate('sender receiver');
  }

  async findOne(userId: string, requestId: string) {
    const userObjId = new Types.ObjectId(userId);
    const requestObjId = new Types.ObjectId(requestId);

    const friendRequest = await this.friendRequestModel.findById(requestObjId);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.receiver.toString() !== userObjId.toString()) {
      throw new ForbiddenException('You are not allowed to view this request');
    }

    return friendRequest;
  }

  async getUserFriendRequests(userId: string) {
    const friendRequests = await this.friendRequestModel.find({
      receiver: userId,
    });

    return friendRequests;
  }

  async acceptRequest(userId: string, requestId: string) {
    const request = await this.friendRequestModel.findById(requestId);

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    // 🔐 Only receiver can accept
    if (request.receiver.toString() !== userId) {
      throw new ForbiddenException(
        'You are not allowed to accept this request',
      );
    }

    if (request.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('Friend request already processed');
    }

    // ✅ Update request status
    request.status = FriendRequestStatus.ACCEPTED;
    await request.save();

    // 🔗 Create friendship
    const friendship = await this.friendsService.create(
      request.sender.toString(),
      request.receiver.toString(),
    );

    if (!friendship) {
      throw new InternalServerErrorException('Failed to create friendship');
    }

    return {
      message: 'Friend request accepted',
      request,
    };
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.friendRequestModel.findById(requestId);

    if (!request) {
      throw new NotFoundException('Friend request not found');
    }

    // 🔐 Only receiver can reject
    if (request.receiver.toString() !== userId) {
      throw new ForbiddenException(
        'You are not allowed to reject this request',
      );
    }

    if (request.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('Friend request already processed');
    }

    request.status = FriendRequestStatus.REJECTED;
    await request.save();

    return {
      message: 'Friend request rejected',
      request,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
