import { Types } from 'mongoose';
import { FriendRequest } from './schema/friendrequests.schema';
import { UserJSON } from 'src/users/schema/users.schema';
import { MongoBase } from 'src/types/common';

export type SendTo = {
  requestId: string | Types.ObjectId;
  to: string | Types.ObjectId;
};

export type ReceiveFrom = {
  requestId: string | Types.ObjectId;
  from: string | Types.ObjectId;
};

export type UserFriendRequest = {
  sendTo: SendTo[];
  receiveFrom: ReceiveFrom[];
};

export type UserFriendRequestPopulated = {
  sendTo: Omit<SendTo, 'to'> & { to: UserJSON }[];
  receiveFrom: Omit<ReceiveFrom, 'from'> & { from: UserJSON }[];
};

export type CreateFriendRequest = Omit<FriendRequest, 'status'> &
  Partial<Pick<FriendRequest, 'status'>>;

export type FriendRequestPopulated = Omit<
  FriendRequest,
  'sender' | 'receiver'
> & {
  sender: UserJSON;
  receiver: UserJSON;
} & MongoBase;
