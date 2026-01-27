import { useSocketContext } from "@/contexts/socket.context";
import useAsyncState from "@/hooks/use-async-state";
import getFriends, { type FriendListResponse } from "@/services/get-freinds";
import { SOCKET_EVENTS } from "@/socket.events.constants";
import { getFriendChildrenRoutes } from "@/utils/getRoutes";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export default function useMain() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data, setData } = useAsyncState();
  const { socket } = useSocketContext();

  const [activeTab, setActiveTab] = React.useState<string>("all");

  const {
    data: allFriends,
    setData: setAllFriends,
    setError: setAllFriendsError,
    error: allFriendsError,
    loading: loadingAllFriends,
    setLoading: setLoadingAllFriends,
  } = useAsyncState<FriendListResponse[]>();

  const friendChilds = getFriendChildrenRoutes();

  const handleValueChange = (value: string) => navigate(value);

  const handleOnlineUsers = (onlineUsers: string[]) => {
    console.log("ONLINE_USERS", onlineUsers);
  };

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

  // GET ONLINE FRIENDS
  React.useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
    }

    return () => {
      if (socket) {
        socket.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
      }
    };
  }, [socket]);

  return {
    friendChilds,
    activeTab,
    allFriends,
    allFriendsError,
    loadingAllFriends,
    handleValueChange,
  };
}
