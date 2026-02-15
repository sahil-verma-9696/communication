import { Types } from 'mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';
import {
  ChatParticipantDocument,
  PARTICIPANT_ROLE,
} from './schema/chat-participants.schema';
import { UserDocument } from 'src/users/schema/users.schema';

export type CreateGroupChat = Omit<
  Chat,
  'lastMessage' | 'unreadCount' | 'isArchived' | 'isDeleted' | 'type'
>;

export type CreateChatParticipant = {
  chatId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  role: PARTICIPANT_ROLE;
};

export type GetChatBetweenUsers = {
  _id: string;
  chat: ChatDocument;
  participant: Omit<ChatParticipantDocument, 'user'> & { user: UserDocument };
};
