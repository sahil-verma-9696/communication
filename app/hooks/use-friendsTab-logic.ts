import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";

export type UserSearchResult = User & {
  isFriend: boolean;
};
export default function useFriendsTabLogic() {
  const [friends, setFriends] = useState<User[] | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(
    null
  );
  const { accessToken } = useGlobalContext();

  const handleQueryChange = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      setSearchResults(null);
    } else {
      searchUsers(text);
    }
  };

  const handleAddFriendClick = (friendId: string) => () => {
    sendFriendRequest(friendId);
  };

  async function searchUsers(query: string) {
    const res = await fetch(`${SERVER_BASE_URL}/users?q=${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    console.log(data, "search users");
    setSearchResults(data);
  }

  async function sendFriendRequest(recieverId: string) {
    console.log(recieverId, "recieverId");
    try {
      const res = await fetch(`${SERVER_BASE_URL}/friendrequests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: recieverId }),
      });
      const data = await res.json();
      console.log(data, "send friend request");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  }

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

  return {
    friends,
    query,
    handleQueryChange,
    handleAddFriendClick,
    searchUsers,
    searchResults,
  };
}
