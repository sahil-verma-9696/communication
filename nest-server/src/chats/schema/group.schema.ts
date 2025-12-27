import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chat: Types.ObjectId;

  @Prop({ default: false })
  onlyAdminsCanMessage: boolean;

  @Prop({ default: true })
  allowInviteLink: boolean;

  @Prop()
  inviteLink?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
