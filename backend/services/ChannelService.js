import Channel from "../models/Channel.js";

export class ChannelService {
  async getChannel(channelId) {
    try {
      return await Channel.findById(channelId);
    } catch (error) {
      console.error("Error getting channel:", error);
      throw error;
    }
  }

  async createChannel(channelData) {
    try {
      const channel = new Channel(channelData);
      return await channel.save();
    } catch (error) {
      console.error("Error creating channel:", error);
      throw error;
    }
  }

  async updateChannel(channelId, channelData) {
    try {
      return await Channel.findByIdAndUpdate(channelId, channelData, {
        new: true,
      });
    } catch (error) {
      console.error("Error updating channel:", error);
      throw error;
    }
  }

  async deleteChannel(channelId) {
    try {
      return await Channel.findByIdAndDelete(channelId);
    } catch (error) {
      console.error("Error deleting channel:", error);
      throw error;
    }
  }

  async getAllChannelsByOwnerId(ownerId) {
    try {
      return await Channel.find({ owner: ownerId }).populate("members");
    } catch (error) {
      console.error("Error getting all channels:", error);
      throw error;
    }
  }
}
