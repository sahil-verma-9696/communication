import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";

export type FriendRequest = {
  _id: string;
  sender: User;
  receiver: User;
};
export default function useFriendRequestsTabLogic() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[] | null>(
    null
  );
  const { accessToken } = useGlobalContext();

  /** Fetching */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${SERVER_BASE_URL}/friendrequests`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        console.log("friend requests ::: ", resData);
        setFriendRequests(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setFriendRequests(null);
      }
    })();
  }, [accessToken]);

  return { friendRequests };
}
