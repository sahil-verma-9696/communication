// handlers/MessageHandler.js
import chalk from "chalk";

export class MessageHandler {
  constructor(messageService, notificationService) {
    this.messageService = messageService;
    this.notificationService = notificationService;
  }

  handleSendMessage(socket) {
    return async (data) => {
      try {
        // Save message
        const message = await this.messageService.saveMessage({
          sender_id: socket.userId,
          recipient_id: data.recipient_id,
          content: data.content,
          attachments: data.attachments || [],
        });

        // Populate sender info
        const populatedMessage = await this.messageService.populateMessage(
          message._id
        );

        // Create message object
        const messageData = this._createMessageObject(
          populatedMessage,
          socket.user
        );

        // Handle offline recipient notifications
        await this._handleOfflineRecipient(socket, data, populatedMessage);

        console.log(chalk.blueBright("[MESSAGE SENT] to "), data.recipient_id);

        // Send to recipient
        socket.to(`user_${data.recipient_id}`).emit("message", {
          ...messageData,
          is_own_message: false,
        });

        // Send confirmation to sender
        socket.emit("message", {
          ...messageData,
          is_own_message: true,
          temp_id: data.temp_id,
        });
      } catch (error) {
        console.error("Message send error:", error);
        socket.emit("error", {
          event: "message",
          message: "Failed to send message",
          temp_id: data.temp_id,
        });
      }
    };
  }

  handleMarkAsRead(socket) {
    return async (data) => {
      try {
        await this.messageService.markMessagesAsRead(
          data.message_ids,
          socket.userId
        );
        await this.notificationService.markMessageNotificationsAsRead(
          data.message_ids,
          socket.userId
        );

        // Notify senders
        for (const messageId of data.message_ids) {
          const message = await this.messageService.getMessage(messageId);
          if (message && message.sender_id.toString() !== socket.userId) {
            socket.to(`user_${message.sender_id}`).emit("read", {
              message_id: messageId,
              read_by: socket.userId,
              read_by_name: socket.user.name,
              read_at: new Date(),
            });
          }
        }

        socket.emit("read", {
          message_ids: data.message_ids,
          confirmed: true,
        });
      } catch (error) {
        console.error("Mark read error:", error);
        socket.emit("error", {
          event: "read",
          message: "Failed to mark messages as read",
        });
      }
    };
  }

  handleDeleteMessage(socket) {
    return async (data) => {
      try {
        const message = await this.messageService.getMessage(data.message_id);

        if (!message || message.sender_id.toString() !== socket.userId) {
          socket.emit("error", {
            event: "delete",
            message: "Cannot delete this message",
          });
          return;
        }

        await this.messageService.deleteMessage(data.message_id);
        await this.notificationService.deleteMessageNotifications(
          data.message_id
        );

        const deleteData = {
          message_id: data.message_id,
          deleted_by: socket.userId,
          deleted_at: new Date(),
        };

        socket.to(`user_${message.recipient_id}`).emit("delete", deleteData);
        socket.emit("delete", { ...deleteData, confirmed: true });
      } catch (error) {
        console.error("Delete message error:", error);
        socket.emit("error", {
          event: "delete",
          message: "Failed to delete message",
        });
      }
    };
  }

  _createMessageObject(populatedMessage, userInfo) {
    return {
      _id: populatedMessage._id,
      sender_id: populatedMessage.sender_id._id,
      sender_name: populatedMessage.sender_id.name,
      sender_avatar: userInfo.avatar || null,
      recipient_id: populatedMessage.recipient_id,
      content: populatedMessage.content,
      attachments: populatedMessage.attachments,
      is_read: populatedMessage.is_read,
      sent_at: populatedMessage.sent_at,
    };
  }

  async _handleOfflineRecipient(socket, data, populatedMessage) {
    const recipientStatus = socket.idToStatusMap.get(data.recipient_id);
    const isRecipientOnline =
      recipientStatus && recipientStatus.status === "online";

    if (!isRecipientOnline) {
      console.log(
        chalk.yellow(
          `[OFFLINE RECIPIENT] Creating notification for user: ${data.recipient_id}`
        )
      );

      try {
        await this.notificationService.createMessageNotification({
          recipientId: data.recipient_id,
          senderId: socket.userId,
          messageId: populatedMessage._id,
          senderName: socket.user.name,
          messageContent: populatedMessage.content,
        });

        const notifications =
          await this.notificationService.getUnreadNotifications(
            data.recipient_id
          );

        socket.to(`user_${data.recipient_id}`).emit("new_notification", {
          count: notifications.length,
        });

        console.log(
          chalk.green(
            `[NOTIFICATION CREATED] For message to offline user: ${data.recipient_id}`
          )
        );
      } catch (notificationError) {
        console.error(chalk.red("[NOTIFICATION ERROR]"), notificationError);
      }
    }
  }
}
