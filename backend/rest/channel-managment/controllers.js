import { ChannelService } from "../../services/ChannelService.js";

const channelService = new ChannelService();

export async function createChannel(req, res) {
  const owner = req.user;

  const { name, description } = req.body;

  const channel = await channelService.createChannel({
    name,
    description,
    owner: owner._id,
  });

  res.status(201).json({ message: "Channel created", data: channel });
}

export async function getAllChannelsByOwnerId(req, res) {
  const channels = await channelService.getAllChannelsByOwnerId(req.user._id);
  res.status(200).json({ message: "Channels found", data: channels });
}
