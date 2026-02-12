import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";
import type { FriendRequest, FriendRequestStatus } from "./get-userProfile";

export function patchFriendRequest(
  reqId: string,
  payload: {
    status: FriendRequestStatus;
  },
) {
  return apiFetch<FriendRequest>({
    url: `${SERVER_URL}/friendrequests/${reqId}?status=${payload.status}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
