import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageEmbedding,
  MessageEmbeddingDocument,
} from './schema/messageEmbeding.schema';
import { Model } from 'mongoose';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  genAI: GoogleGenerativeAI;
  chat: GenerativeModel;
  embedding: GenerativeModel;

  /*****************************************************************
   * ************ Constructor **********************************
   *********************************************************************/

  /**
   *
   * @param messageEmbeddingModel
   */
  constructor(
    @InjectModel(MessageEmbedding.name)
    private messageEmbeddingModel: Model<MessageEmbeddingDocument>,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.chat = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.embedding = this.genAI.getGenerativeModel({
      model: 'text-embedding-004',
    });
  }

  /*****************************************************************
   * ************ METHODS ******************************************
   *********************************************************************/

  /**
   * embedText
   * ----------------------------
   * @param text
   * @returns Promise<number[]>
   */
  async embedText(text: string): Promise<number[]> {
    const result = await this.embedding.embedContent(text);
    return result.embedding.values;
  }

  async storeMessageEmbedding(params: {
    content: string;
    chatId: string;
    userId: string;
    messageId: string;
  }) {
    const embedding = await this.embedText(params.content);

    await this.messageEmbeddingModel.create({
      embedding: embedding,
      content: params.content,
      chatId: params.chatId,
      senderId: params.userId,
      messageId: params.messageId,
    });
  }

  async recallMessages(chatId: string, query: string, limit = 5) {
    const queryEmbedding = await this.embedText(query);

    return this.messageEmbeddingModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
          filter: { chatId },
        },
      },
      {
        $project: {
          content: 1,
          messageId: 1,
          userId: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
  }

  async answerFromChat(chatId: string, userQuery: string) {
    const docs = await this.recallMessages(chatId, userQuery);

    if (!docs.length) {
      return 'I could not find relevant information in this chat.';
    }

    const context = docs.map((d) => d.content).join('\n');

    const prompt = `
You are an AI assistant inside a chat application.
Answer ONLY using the context below.
If the answer is not present, say "I don't know".

Context:
${context}

Question:
${userQuery}
`;

    const response = await this.chat.generateContent(prompt);
    return response.response.text();
  }

  async summarizeChat(messages: string[]) {
    const prompt = `
Summarize the following conversation.
Focus on decisions, action items, and conclusions.

${messages.join('\n')}
`;

    const response = await this.chat.generateContent(prompt);
    return response.response.text();
  }
}
