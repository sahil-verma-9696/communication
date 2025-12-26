import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  SYSTEM = 'system',
  AI = 'ai',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Prop()
  text?: string;

  // Attachments
  // @Prop({
  //   type: [
  //     {
  //       url: String,
  //       type: String,
  //       size: Number,
  //       name: String,
  //     },
  //   ],
  // })
  // attachments?: {
  //   url: string;
  //   type: string;
  //   size: number;
  //   name: string;
  // }[];

  // Reply support
  @Prop({ type: Types.ObjectId, ref: 'Message' })
  replyTo?: Types.ObjectId;

  // Read receipts
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  readBy: Types.ObjectId[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// 🔥 Query optimization
MessageSchema.index({ chat: 1, createdAt: -1 });
