import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { FriendRequest } from "./get-userProfile";

export function postFriendRequest(userId: string) {
  return apiFetch<FriendRequest>({
    url: `${SERVER_URL}/friendrequests?friendId=${userId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
