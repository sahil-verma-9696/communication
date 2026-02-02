import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import type { User } from "./auth";

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

export type UserProfileResponse = {
  user: User;
  account: Account;
  accountLifecycle?: AccountLifecycle | null;
};

export function getUserProfile(userId: string) {
  return apiFetch<UserProfileResponse>({
    url: `${SERVER_URL}/users/${userId}/profile`,
    method: "GET",
  });
}
