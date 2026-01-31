import { SERVER_URL } from "@/app.constatns";
import { useAppContext } from "@/contexts/app.context";
import useAsyncState from "@/hooks/use-async-state";
import getFriends, { type FriendListResponse } from "@/services/get-freinds";
import localSpace from "@/services/local-space";
import type { User } from "@/services/auth";
import { getFriendChildrenRoutes } from "@/utils/getRoutes";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export type SearchResult = User & {
  isFriend: boolean;
  directChatId: string | null;
};

export default function useMain() {
  const friendChilds = getFriendChildrenRoutes();
  const accessToken = localSpace.getAccessToken();

  const location = useLocation();
  const navigate = useNavigate();

  const { onlineUsers } = useAppContext();

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [query, setQuery] = React.useState<string>("");

  const {
    data: searchResults,
    setData: setSearchResults,
    error: searchResultsError,
    setError: setSearchResultsError,
    loading: searchResultsLoading,
    setLoading: setSearchResultsLoading,
  } = useAsyncState<SearchResult[]>();

  const {
    data: allFriends,
    setData: setAllFriends,
    error: allFriendsError,
    setError: setAllFriendsError,
    loading: loadingAllFriends,
    setLoading: setLoadingAllFriends,
  } = useAsyncState<FriendListResponse[]>();

  // MAP friends with online status
  const allFriendsWithStatus = React.useMemo(() => {
    return allFriends?.map((friend) => {
      return {
        ...friend,
        online: onlineUsers.some((user) => user.userId === friend._id),
      };
    });
  }, [allFriends, onlineUsers]);

  // FILTER online friends
  const onlineFriends = React.useMemo(() => {
    return allFriendsWithStatus?.filter((friend) => friend.online) ?? [];
  }, [allFriendsWithStatus]);

  const handleValueChange = (value: string) => navigate(value);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(e.target.value);

    if (accessToken && value.length > 0) {
      setSearchResultsLoading(true);
      (async () => {
        try {
          const res = await fetch(`${SERVER_URL}/users?q=${value}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();

          setSearchResults(data);
          setSearchResultsLoading(false);
        } catch (error) {
          setSearchResultsError((error as Error).message);
          setSearchResultsLoading(false);
        }
      })();
    }
  };

  const handleSelectResult = (result) => {};

  // SET ACTIVE TAB
  React.useEffect(() => {
    const path = location.pathname.split("/").filter(Boolean).at(-1) ?? "all";
    setActiveTab(path);
  }, [location.pathname]);

  // GET ALL FRIENDS
  React.useEffect(() => {
    (async () => {
      try {
        setLoadingAllFriends(true);
        const friends = await getFriends();
        console.log(friends);

        setAllFriends(friends);

        setLoadingAllFriends(false);
      } catch (error) {
        setAllFriendsError((error as Error).message);
        setLoadingAllFriends(false);
      } finally {
        setLoadingAllFriends(false);
      }
    })();
  }, []);

  return {
    friendChilds,
    activeTab,
    allFriendsWithStatus,
    onlineFriends,
    allFriendsError,
    loadingAllFriends,
    handleValueChange,
    searchResults,
    searchResultsLoading,
    query,
    handleQueryChange,
    handleSelectResult,
  };
}
