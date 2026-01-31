import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from './account.schema';
import { getNextNthDate } from 'src/utilities/get-next-nth-date';

export type AccountLifecycleDocument = HydratedDocument<AccountLifecycle>;

@Schema({ timestamps: true })
export class AccountLifecycle {
  @Prop({ type: Types.ObjectId, ref: Account.name, required: true })
  account: Types.ObjectId;

  @Prop({ type: Date, required: true, default: getNextNthDate(3) })
  trialEndAt: Date;

  @Prop({ type: Date, required: true, default: getNextNthDate(6) })
  accountDeletedAt: Date;
}

export const AccountLifecycleSchema =
  SchemaFactory.createForClass(AccountLifecycle);
