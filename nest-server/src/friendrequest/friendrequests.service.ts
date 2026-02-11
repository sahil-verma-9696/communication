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

    // 🔔 Send notification
    await this.notificationService.createNotification({
      userId: request.sender.toString(),
      type: NotificationType.FRIEND_REQUEST,
      title: 'Friend request accepted',
      message: 'Your friend request has been accepted',
      triggeredBy: userId,
    });

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

    // 🔔 Send notification
    await this.notificationService.createNotification({
      userId: request.sender.toString(),
      type: NotificationType.FRIEND_REQUEST,
      title: 'Friend request rejected',
      message: `Your friend request has been rejected by ${userId}`,
      triggeredBy: userId,
    });

    return {
      message: 'Friend request rejected',
      request,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
