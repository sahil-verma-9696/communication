import { Types } from 'mongoose';

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
