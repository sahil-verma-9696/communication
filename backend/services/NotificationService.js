import Notification from "../models/Notification.js";
import chalk from "chalk";

export class NotificationService {
  async createMessageNotification({
    recipientId,
    senderId,
    messageId,
    senderName,
    messageContent,
  }) {
    try {
      // Check if notification already exists
      const existingNotification = await Notification.findOne({
        user_id: recipientId,
        type: "message",
        related_id: messageId,
      });

      if (existingNotification) {
        console.log(`Notification already exists for message: ${messageId}`);
        return existingNotification;
      }

      const notification = new Notification({
        user_id: recipientId,
        type: "message",
        related_id: messageId,
        is_read: false,
        created_at: new Date(),
        metadata: {
          sender_id: senderId,
          sender_name: senderName,
          message_preview: messageContent.substring(0, 100),
          created_at: new Date(),
        },
      });

      const savedNotification = await notification.save();
      console.log(
        chalk.green(`[NOTIFICATION SAVED] ID: ${savedNotification._id}`)
      );
      return savedNotification;
    } catch (error) {
      console.error("Error creating message notification:", error);
      throw error;
    }
  }

  async getUnreadNotifications(userId) {
    try {
      return await Notification.find({
        user_id: userId,
        is_read: false,
      })
        .populate("related_id")
        .sort({ created_at: -1 })
        .limit(50);
    } catch (error) {
      console.error("Error getting unread notifications:", error);
      throw error;
    }
  }

  async markMessageNotificationsAsRead(messageIds, userId) {
    try {
      const result = await Notification.updateMany(
        {
          user_id: userId,
          type: "message",
          related_id: { $in: messageIds },
          is_read: false,
        },
        {
          is_read: true,
          read_at: new Date(),
        }
      );

      console.log(
        chalk.blue(`[NOTIFICATIONS MARKED READ] Count: ${result.modifiedCount}`)
      );
      return result;
    } catch (error) {
      console.error("Error marking message notifications as read:", error);
      throw error;
    }
  }

  async markNotificationsAsRead(notificationIds, userId) {
    try {
      return await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          user_id: userId,
          is_read: false,
        },
        {
          is_read: true,
          read_at: new Date(),
        }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }

  async deleteMessageNotifications(messageId) {
    try {
      const result = await Notification.deleteMany({
        type: "message",
        related_id: messageId,
      });

      console.log(
        chalk.yellow(
          `[NOTIFICATIONS DELETED] Count: ${result.deletedCount} for message: ${messageId}`
        )
      );
      return result;
    } catch (error) {
      console.error("Error deleting message notifications:", error);
      throw error;
    }
  }
}
