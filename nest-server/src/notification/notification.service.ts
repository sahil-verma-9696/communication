import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schema/notification.schema';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly socketService: SocketService,
  ) {}

  // ------------------------------------
  // CREATE NOTIFICATION
  // ------------------------------------
  async createNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    triggeredBy?: string;
    meta?: Record<string, any>;
    redirectUrl?: string;
  }) {
    const notification = await this.notificationModel.create({
      user: new Types.ObjectId(params.userId),
      type: params.type,
      title: params.title,
      message: params.message,
      triggeredBy: params.triggeredBy
        ? new Types.ObjectId(params.triggeredBy)
        : undefined,
      meta: params.meta,
      redirectUrl: params.redirectUrl,
    });

    if (!notification) {
      throw new Error('Failed to create notification');
    }

    // send notification via socket
    this.socketService.sendNotification(params.userId, notification);

    return notification;
  }

  // ------------------------------------
  // GET USER NOTIFICATIONS
  // ------------------------------------
  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('user triggeredBy');
  }

  // ------------------------------------
  // GET UNREAD COUNT
  // ------------------------------------
  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      user: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  // ------------------------------------
  // MARK SINGLE NOTIFICATION AS READ
  // ------------------------------------
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        user: new Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  // ------------------------------------
  // MARK ALL AS READ
  // ------------------------------------
  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { user: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );

    return { message: 'All notifications marked as read' };
  }

  // ------------------------------------
  // DELETE NOTIFICATION
  // ------------------------------------
  async remove(userId: string, notificationId: string) {
    const deleted = await this.notificationModel.findOneAndDelete({
      _id: new Types.ObjectId(notificationId),
      user: new Types.ObjectId(userId),
    });

    if (!deleted) {
      throw new NotFoundException('Notification not found');
    }

    return { message: 'Notification deleted' };
  }
}
