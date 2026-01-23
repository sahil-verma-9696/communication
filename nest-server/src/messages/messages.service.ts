import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Message,
  MessageDocument,
  MessageType,
} from './schema/messages.schema';
import { Model, Types } from 'mongoose';
import { SocketService } from 'src/socket/socket.service';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly socketService: SocketService,
    private readonly aiService: AiService,
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
    text?: string,
  ) {
    // 1️⃣ Normal user message
    const newMessage = await this.messageModel.create({
      chat: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(senderId),
      type,
      text,
    });

    const populatedMessage = await this.messageModel
      .findById(newMessage._id)
      .populate('sender');

    // Store embedding for user message
    if (text) {
      await this.aiService.storeMessageEmbedding({
        content: text,
        chatId,
        userId: senderId,
        messageId: newMessage._id.toString(),
      });
    }

    // Emit user message
    this.socketService.sendMessage(chatId, senderId, populatedMessage);

    const AI_USER_ID = new Types.ObjectId('000000000000000000000000');

    // 2️⃣ Check for AI command
    if (text?.toLowerCase().startsWith('@ai')) {
      const query = text.replace(/^@ai/i, '').trim();

      if (!query) return populatedMessage;

      // 3️⃣ Ask AI using chat context
      const aiAnswer = await this.aiService.answerFromChat(chatId, query);

      console.log('AI Answer : ', aiAnswer);

      // 4️⃣ Store AI message
      const aiMessage = await this.messageModel.create({
        chat: new Types.ObjectId(chatId),
        sender: new Types.ObjectId(AI_USER_ID),
        type: MessageType.TEXT,
        text: aiAnswer,
      });
      console.log('AI aiMessage : ', aiMessage);

      const populatedAiMessage = await this.messageModel
        .findById(aiMessage._id)
        .populate('sender');
      console.log('AI populatedAiMessage : ', populatedAiMessage);

      // 5️⃣ Store embedding for AI response (optional but recommended)
      await this.aiService.storeMessageEmbedding({
        content: aiAnswer,
        chatId,
        userId: AI_USER_ID.toString(),
        messageId: aiMessage._id.toString(),
      });

      // 6️⃣ Emit AI response
      this.socketService.sendMessage(
        chatId,
        AI_USER_ID.toString(),
        populatedAiMessage,
      );
    }

    return populatedMessage;
  }

  findAll(chatId: string) {
    return this.messageModel
      .find({ chat: new Types.ObjectId(chatId) })
      .populate('sender chat')
      .sort({ createdAt: 1 });
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
