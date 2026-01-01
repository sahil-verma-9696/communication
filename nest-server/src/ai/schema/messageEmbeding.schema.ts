import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageEmbeddingDocument = HydratedDocument<MessageEmbedding>;

@Schema({ timestamps: true })
export class MessageEmbedding {
  @Prop({ type: [Number], required: true })
  embedding: number[];

  @Prop()
  content: string;

  @Prop()
  chatId: string;

  @Prop()
  senderId: string;

  @Prop()
  messageId: string;
}

export const MessageEmbeddingSchema =
  SchemaFactory.createForClass(MessageEmbedding);
