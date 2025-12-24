import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FriendDocument = HydratedDocument<Friend>;

@Schema({ timestamps: true })
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  friend: Types.ObjectId;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

/**
 * 🔐 Ensure uniqueness of friend
 * (A-B is same as B-A)
 */
// FriendSchema.index({ user: 1, friend: 1 }, { unique: true });
