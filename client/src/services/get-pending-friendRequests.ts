import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { FriendRequestStatus } from "./get-userProfile";
import type { User } from "./auth";

export type PendingRequest = {
  _id: string;
  sender: string;
  receiver: User;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export function getPendingFriendRequests() {
  return apiFetch<PendingRequest[]>({
    url: `${SERVER_URL}/friendrequests?status=pending`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
