import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
}

@Schema({ timestamps: true })
export class Chat {
  @Prop({ enum: ChatType, required: true })
  type: ChatType;

  // For group chat
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  // @Prop()
  // avatar?: string;

  // Optimization: last message preview
  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  lastMessage?: Types.ObjectId;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
