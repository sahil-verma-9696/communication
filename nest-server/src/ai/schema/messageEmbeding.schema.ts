import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageEmbeddingDocument = HydratedDocument<MessageEmbedding>;

@Schema({ timestamps: true })
export class MessageEmbedding {
  @Prop({ type: [Number], required: true })
  embedding: number[];

  @Prop({ type: String, required: true })
  content: string; // text

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Message', required: true })
  messageId: Types.ObjectId;
}

export const MessageEmbeddingSchema =
  SchemaFactory.createForClass(MessageEmbedding);
