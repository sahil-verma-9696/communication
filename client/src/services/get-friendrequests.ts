import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { FriendRequestStatus } from "./get-userProfile";
import type { User } from "./auth";

export type FriendRequest = {
  _id: string;
  sender: User;
  receiver: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export function getFriendRequests() {
  return apiFetch<FriendRequest[]>({
    url: `${SERVER_URL}/friendrequests`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
