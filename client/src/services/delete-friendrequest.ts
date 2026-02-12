import { SERVER_URL } from "@/app.constatns";
import { apiFetch } from "@/utils/api-fetch";
import localSpace from "./local-space";

export function deleteFriendRequest(reqId: string) {
  return apiFetch({
    url: `${SERVER_URL}/friendrequests/${reqId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
