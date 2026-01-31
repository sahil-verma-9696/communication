import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcryptjs';

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export type AccountDocument = HydratedDocument<Account>;

export type AccountWithUser = Omit<Account, 'user'> & {
  user: UserDocument;
};

export type AccountWithUserDoc = HydratedDocument<AccountWithUser>;

@Schema({
  timestamps: true,
  methods: {
    // ✅ INSTANCE METHOD (Actual)
    verifyPassword: function (
      this: AccountDocument,
      plainPassword: string,
    ): Promise<boolean> {
      return bcrypt.compare(plainPassword, this.passwordHash);
    },
  },
})
export class Account {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Prop({ required: true, select: false })
  passwordHash: string;

  /** ✅ INSTANCE METHOD (Placeholder) for type support. */
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.passwordHash);
  }
}

export const AccountSchema = SchemaFactory.createForClass(Account);

function hashPassword(this: HydratedDocument<Account>) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = bcrypt.hashSync(this.passwordHash, 10);
  }
}

AccountSchema.pre<Account>('save', hashPassword);
