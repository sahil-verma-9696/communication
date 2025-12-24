/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User, UserMethods>;
export type UserWithoutPassword = Omit<UserDocument, 'passwordHash'>;
export interface UserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * 🔒 Pre-save hook for hashing password
 */
UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('passwordHash')) return;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

/**
 * 🔐 Instance method for password comparison
 */
UserSchema.methods.comparePassword = function (
  this: UserDocument,
  plainPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.passwordHash);
};
