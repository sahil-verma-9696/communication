import { Types } from 'mongoose';
import { Friend } from './schema/friends.schema';

export interface FriendListItem {
  _id: Types.ObjectId;
  name: string;
  email: string;
  directChatId: Types.ObjectId | null;
  avatar?: string | null;
}
export interface FriendListResponse {
  _id: string;
  name: string;
  email: string;
  directChatId: string | null;
}

export type CreateFriend = Omit<Friend, 'isBlocked' | 'blockedBy'> & {
  isBlocked?: boolean;
};
