import useAsyncState from "@/hooks/use-async-state";
import getFriends, { type FriendListResponse } from "@/services/get-freinds";
import { getFriendChildrenRoutes } from "@/utils/getRoutes";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export default function useMain() {

  const [activeTab, setActiveTab] = React.useState<string>("all");

  const {
    data: allFriends,
    setData: setAllFriends,
    setError: setAllFriendsError,
    error: allFriendsError,
    loading: loadingAllFriends,
    setLoading: setLoadingAllFriends,
  } = useAsyncState<FriendListResponse[]>();

  const location = useLocation();
  const navigate = useNavigate();

  const friendChilds = getFriendChildrenRoutes();

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
        console.log(friends)

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

  const handleValueChange = (value: string) => navigate(value);

  return {
    friendChilds,
    activeTab,
    allFriends,
    allFriendsError,
    loadingAllFriends,
    handleValueChange,
  };
}
