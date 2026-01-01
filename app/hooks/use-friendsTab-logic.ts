import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";

export default function useFriendsTabLogic() {
  const [friends, setFriends] = useState<User[] | null>(null);
  const { accessToken } = useGlobalContext();

  /** Fetching messages */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${SERVER_BASE_URL}/friends`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        console.log(resData, "resData");
        setFriends(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setFriends(null);
      }
    })();
  }, [accessToken]);

  return { friends };
}
