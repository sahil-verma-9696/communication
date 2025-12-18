import Message from "../models/Message.js";

export class MessageService {
  async saveMessage(messageData) {
    try {
      const message = new Message({
        sender_id: messageData.sender_id,
        recipient_id: messageData.recipient_id,
        content: messageData.content,
        attachments: messageData.attachments || [],
        sent_at: new Date(),
        is_read: false,
      });

      const savedMessage = await message.save();
      return savedMessage.toObject();
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  }

  async getMessage(messageId) {
    try {
      return await Message.findById(messageId);
    } catch (error) {
      console.error("Error getting message:", error);
      throw error;
    }
  }

  async markMessagesAsRead(messageIds, userId) {
    try {
      return await Message.updateMany(
        {
          _id: { $in: messageIds },
          recipient_id: userId,
          is_read: false,
        },
        {
          is_read: true,
          read_at: new Date(),
        }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  async deleteMessage(messageId) {
    try {
      return await Message.findByIdAndDelete(messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  async populateMessage(messageId) {
    try {
      return await Message.findById(messageId).populate(
        "sender_id",
        "name email"
      );
    } catch (error) {
      console.error("Error populating message:", error);
      throw error;
    }
  }
}
