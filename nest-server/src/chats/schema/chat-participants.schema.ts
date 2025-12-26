import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatParticipantDocument = ChatParticipant & Document;

export enum ChatParticipantRole {
  OWNER = 'owner',
  PARTICIPANT = 'participant',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class ChatParticipant {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ChatParticipantRole,
    required: true,
    default: ChatParticipantRole.PARTICIPANT,
  })
  role: ChatParticipantRole;

  @Prop({ default: 0 })
  unreadCount: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChatParticipantSchema =
  SchemaFactory.createForClass(ChatParticipant);
