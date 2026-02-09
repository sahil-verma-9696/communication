import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MongoBase } from 'src/types/common';

export type UserDocument = HydratedDocument<User>;

export type UserJSON = User & MongoBase;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, default: null })
  avatar: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * unique : true means.
 *
 * - email & name must be unique
 *
 * i.e.
 *
 * {
 *  name : "abc",
 *  email : "123",
 * }
 *
 * {
 *  name : "abc",
 *  email : "123",
 * }
 *
 * will throw error
 */
UserSchema.index({ email: 1, name: 1 }, { unique: true });
