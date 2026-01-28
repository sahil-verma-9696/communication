import { useAppContext } from "@/contexts/app.context";
import useAsyncState from "@/hooks/use-async-state";
import getFriends, { type FriendListResponse } from "@/services/get-freinds";
import { getFriendChildrenRoutes } from "@/utils/getRoutes";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export default function useMain() {
  const friendChilds = getFriendChildrenRoutes();

  const location = useLocation();
  const navigate = useNavigate();

  const { onlineUsers } = useAppContext();

  const [activeTab, setActiveTab] = React.useState<string>("all");

  const {
    data: allFriends,
    setData: setAllFriends,
    setError: setAllFriendsError,
    error: allFriendsError,
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
  };
}
