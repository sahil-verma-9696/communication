import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import type { User } from "./auth";
import localSpace from "./local-space";

export type Account = {
  _id: string;
  user: string;
  isEmailVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AccountLifecycle = {
  _id: string;
  account: string;
  trialEndAt: string;
  accountDeletedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const FriendRequestStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type FriendRequestStatus =
  (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus];

export type FriendRequest = {
  _id: string;
  sender: string;
  receiver: string;
  status: FriendRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type UserProfileResponse = {
  user: User;
  account: Account;
  accountLifecycle?: AccountLifecycle | null;
} & UserProfileOther;

export type UserProfileOther = {
  friendRequest: FriendRequest | null;
  chat: null;
};

export function getUserProfile(userId: string) {
  return apiFetch<UserProfileResponse>({
    url: `${SERVER_URL}/users/${userId}/profile`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
