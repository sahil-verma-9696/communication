import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";
/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

export interface FriendListResponse {
  _id: string;
  name: string;
  email: string;
  directChatId: string | null;
}

/**
 * Get friends of a user
 * -----------------------
 *
 * using network it fetch the friends of a user.
 */
export default async function getFriends(): Promise<FriendListResponse[]> {
  return apiFetch<FriendListResponse[]>({
    url: `${SERVER_URL}/friends`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
