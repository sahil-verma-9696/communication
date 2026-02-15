import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatParticipantDocument = ChatParticipant & Document;

export enum PARTICIPANT_ROLE {
  OWNER = 'owner',
  MEMBER = 'member',
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
    enum: PARTICIPANT_ROLE,
    required: true,
    default: PARTICIPANT_ROLE.MEMBER,
  })
  role: PARTICIPANT_ROLE;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChatParticipantSchema =
  SchemaFactory.createForClass(ChatParticipant);
