import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Message,
  MessageDocument,
  MessageType,
} from './schema/messages.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  /**
   * create : create a new message
   * -----------------------------
   * @param chatId
   * @param senderId
   * @param type
   * @param text
   * @returns
   */
  async create(
    chatId: string,
    senderId: string,
    type: MessageType,
    text: string | undefined,
  ) {
    const newMessage = await this.messageModel.create({
      chat: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(senderId),
      type,
      text,
    });

    return newMessage;
  }

  findAll(chatId: string) {
    return this.messageModel
      .find({ chat: new Types.ObjectId(chatId) })
      .populate('sender chat');
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: any) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
