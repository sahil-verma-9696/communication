import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FriendDocument = HydratedDocument<Friend>;

@Schema({ timestamps: true })
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  friend: Types.ObjectId | string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  blockedBy: Types.ObjectId | string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

/**
 * 🔐 Ensure uniqueness of friend
 * (A-B is same as B-A)
 */
// FriendSchema.index({ user: 1, friend: 1 }, { unique: true });
