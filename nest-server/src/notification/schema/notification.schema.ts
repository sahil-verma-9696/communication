import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // receiver of notification

  @Prop({ type: Types.ObjectId, ref: 'User' })
  triggeredBy?: Types.ObjectId; // sender / actor

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop()
  message?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  meta?: Record<string, any>; // flexible payload (requestId, chatId, etc.)

  @Prop()
  redirectUrl?: string; // frontend navigation
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
