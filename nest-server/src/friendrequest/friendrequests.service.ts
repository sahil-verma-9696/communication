import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
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
import { FriendRequestRepo } from './repos/friendrequest.repo';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/EVENTS';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    private friendsService: FriendsService,
    private notificationService: NotificationService,
    private friendRequestRepo: FriendRequestRepo,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   */
  async sendRequest(userId: string, friendId: string) {
    // ❌ Prevent self request
    if (userId === friendId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // 🔍 Check if any request exists between users (both directions)
    const existingRequest =
      await this.friendRequestRepo.getFriendRequestBetweenUsersRaw(
        userId,
        friendId,
      );

    // ✅ If request exists, handle by status
    if (existingRequest) {
      throw new ConflictException('Friend request already exists');
    }

    // ✅ No request exists → create new
    const friendRequest = await this.friendRequestRepo.create({
      sender: userId,
      receiver: friendId,
    });

    // Publish event for subscribers
    this.eventEmitter.emit(EVENTS.FRIEND_REQUEST.CREATED, friendRequest);

    return friendRequest;
  }

  /**
   * get all friend requests comming to user
   */
  findAll(userId: string) {
    return this.friendRequestRepo.getFriendRequestByUserIdPopulated(userId);
  }

  async getSentFriendRequests(userId: string) {
    const senderId = new Types.ObjectId(userId);

    return this.friendRequestModel
      .find({
        sender: senderId,
        status: FriendRequestStatus.PENDING, // optional filter
      })
      .populate('receiver', '_id name email')
      .select('_id receiver status createdAt')
      .sort({ createdAt: -1 });
  }

  async getReceivedFriendRequests(userId: string) {
    const receiverId = new Types.ObjectId(userId);

    return this.friendRequestModel
      .find({
        receiver: receiverId,
        status: FriendRequestStatus.PENDING, // optional filter
      })
      .populate('sender', '_id name email')
      .select('_id sender status createdAt')
      .sort({ createdAt: -1 });
  }

  async findOne(userId: string, requestId: string) {
    const friendRequest = await this.friendRequestRepo.getByIdRaw(requestId);

    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendRequest.receiver.toString() !== userId) {
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

  async updateRequestStatus(
    reqId: string,
    userId: string,
    status: FriendRequestStatus,
  ) {
    const updatedReq = await this.friendRequestRepo.updateStatusByReciverRaw(
      reqId,
      userId,
      status,
    );

    this.eventEmitter.emit(EVENTS.FRIEND_REQUEST.UPDATED, updatedReq);

    return updatedReq;
  }

  remove(reqId: string, userId: string) {
    return this.friendRequestRepo.deleteBySender(reqId, userId);
  }
}
