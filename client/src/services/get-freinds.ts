import { SERVER_URL } from "@/app.constatns";
import localSpace from "./local-space";
import { apiFetch } from "@/utils/api-fetch";
import type { User } from "./auth";
/*******************************************************************
 *********************************** Types *************************
 *******************************************************************/

export interface Friend {
  _id: string;
  user: User;
  friend: User;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Get friends of a user
 * -----------------------
 *
 * using network it fetch the friends of a user.
 */
export default async function getFriends(): Promise<Friend[]> {
  return apiFetch<Friend[]>({
    url: `${SERVER_URL}/friends`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localSpace.getAccessToken()}`,
    },
  });
}
