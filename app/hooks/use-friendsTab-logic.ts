import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";
import { FriendsPageContextType } from "@/context/friendsPage.context";
import { router } from "expo-router";

export type UserSearchResult = User & {
  isFriend: boolean;
  directChatId: string | null;
};

export type Friend = User & {
  directChatId: string | null;
};

export default function useFriendsTabLogic(): FriendsPageContextType {
  /********************************************************
   * ********************** Local States *********************
   *************************************************************/
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(
    null
  );
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [startChatLoading, setStartChatLoading] = useState(false);
  const [sendFriendRequestLoading, setSendFriendRequestLoading] =
    useState(false);

  /********************************************************
   * ********************** Other Hooks *********************
   *************************************************************/
  const { accessToken } = useGlobalContext();

  /********************************************************
   * ********************** Handlers *********************
   *************************************************************/

  /**
   * handle message
   * -------------------
   *
   */
  const handleMessage = (chatId: string) => () => {
    router.push({
      pathname: "/chats/[chatId]",
      params: { chatId },
    });
  };

  /**
   * handle start chat
   * -------------------
   *
   */
  const handleStartChat = (friendId: string) => async () => {
    try {
      if (!friendId) {
        throw new Error("Friend id is required");
      }
      setStartChatLoading(true);
      const res = await fetch(`${SERVER_BASE_URL}/chats`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatType: "direct", participants: [friendId] }),
      });

      if (!res.ok) {
        setStartChatLoading(false);
        const err = await res.json();
        throw new Error(err.message);
      }

      const data = await res.json();

      setStartChatLoading(false);
      router.push({
        pathname: "/chats/[chatId]",
        params: { chatId: data._id },
      });
    } catch (error) {
      setStartChatLoading(false);
      console.error("Error starting chat:", error);
    }
  };

  /**
   * handle query change
   * -------------------
   * @param text
   */
  const handleQueryChange = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      setSearchResults(null);
    } else {
      searchUsers(text);
    }
  };

  /**
   * handle add friend click
   * -------------------
   * @param friendId
   * @returns
   */
  const handleSendFriendRequest = (friendId: string) => () => {
    sendFriendRequest(friendId);
  };

  /********************************************************
   * ********************** Functions *********************
   *************************************************************/

  /**
   * search users
   * ------------
   * @param query
   */
  async function searchUsers(query: string) {
    setSearchResultsLoading(true);
    const res = await fetch(`${SERVER_BASE_URL}/users?q=${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    console.log(data, "search users");
    setSearchResults(data);
    setSearchResultsLoading(false);
  }

  /**
   * send friend request
   * -------------------
   * @param recieverId
   */
  async function sendFriendRequest(friendId: string) {
    try {
      if (!friendId) {
        throw new Error("friendId id is required");
      }
      setSendFriendRequestLoading(true);
      const res = await fetch(`${SERVER_BASE_URL}/friendrequests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: friendId }),
      });
      const data = await res.json();
      setSendFriendRequestLoading(false);
      console.log(data, "send friend request");
    } catch (error) {
      console.error("Error sending friend request:", error);
      setSendFriendRequestLoading(false);
    }
  }

  /********************************************************
   * ********************** Effects *********************
   *************************************************************/

  /** Fetching messages */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        setFriendsLoading(true);
        const res = await fetch(`${SERVER_BASE_URL}/friends`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        console.log(resData, "Friends");
        setFriends(resData);
        setFriendsLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setFriends(null);
        setFriendsLoading(false);
      }
    })();
  }, [accessToken]);

  /********************************************************
   * ********************** Returns *********************
   *************************************************************/
  return {
    friends,
    query,
    searchResults,
    friendsLoading,
    searchResultsLoading,
    startChatLoading,
    sendFriendRequestLoading,
    handleQueryChange,
    handleSendFriendRequest,
    handleStartChat,
    handleMessage,
  };
}
