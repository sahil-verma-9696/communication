// services/UserService.js
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";

export class UserService {
  async getUserFriends(userId) {
    try {
      const friendships = await Friendship.find({
        $or: [
          { requester_id: userId, status: "accepted" },
          { recipient_id: userId, status: "accepted" },
        ],
      }).populate("requester_id recipient_id", "name email avatar");

      return friendships.map((friendship) => {
        const friend =
          friendship.requester_id._id.toString() === userId
            ? friendship.recipient_id
            : friendship.requester_id;

        return {
          id: friend._id,
          name: friend.name,
          email: friend.email,
          avatar: friend.avatar,
        };
      });
    } catch (error) {
      console.error("Error getting user friends:", error);
      throw error;
    }
  }

  async areFriends(userId1, userId2) {
    try {
      const friendship = await Friendship.findOne({
        $or: [
          { requester_id: userId1, recipient_id: userId2, status: "accepted" },
          { requester_id: userId2, recipient_id: userId1, status: "accepted" },
        ],
      });

      return !!friendship;
    } catch (error) {
      console.error("Error checking friendship:", error);
      return false;
    }
  }

  async validateRecipient(senderId, recipientId) {
    try {
      const recipient = await User.findById(recipientId);
      return !!recipient;
    } catch (error) {
      console.error("Error validating recipient:", error);
      return false;
    }
  }
}
