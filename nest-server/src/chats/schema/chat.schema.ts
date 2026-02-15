import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

export enum CHAT_TYPE {
  DIRECT = 'direct',
  GROUP = 'group',
}

@Schema({ timestamps: true })
export class Chat {
  @Prop({ enum: CHAT_TYPE, required: true })
  type: CHAT_TYPE;

  @Prop({ type: String, default: null })
  name: string | null;

  @Prop({ type: String, default: null })
  description: string | null;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  lastMessage: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: Types.ObjectId | string;

  @Prop({ type: Number, default: 0 })
  unreadCount: number;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
