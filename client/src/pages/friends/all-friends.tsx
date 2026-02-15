import {
  Loader2,
  AlertCircle,
  Users,
  MessageCircleIcon,
  Phone,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAsyncState from "@/hooks/use-async-state";
import React from "react";
import getFriends, { type Friend } from "@/services/get-freinds";
import { useAppContext } from "@/contexts/app.context";
import { UserListItem } from "@/components/user-list-item";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import localSpace from "@/services/local-space";

export default function Page() {
  const { onlineUsers } = useAppContext();

  const {
    data: allFriends,
    setData: setAllFriends,
    error: allFriendsError,
    setError: setAllFriendsError,
    loading: loadingAllFriends,
    setLoading: setLoadingAllFriends,
  } = useAsyncState<Friend[]>();

  // MAP friends with online status
  const allFriendsWithStatus = React.useMemo(() => {
    return allFriends?.map((friend) => {
      return {
        friend,
        online: onlineUsers.some((user) => user.userId === friend.friend._id),
      };
    });
  }, [allFriends, onlineUsers]);

  // GET ALL FRIENDS
  React.useEffect(() => {
    (async () => {
      try {
        setLoadingAllFriends(true);
        const friends = await getFriends();

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

  // 1️⃣ Loading state
  if (loadingAllFriends) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading friends...
        </span>
      </div>
    );
  }

  // 2️⃣ Error state
  if (allFriendsError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm font-medium">Failed to load friends</p>
        <p className="text-sm text-muted-foreground">{allFriendsError}</p>
      </div>
    );
  }

  // 3️⃣ Empty state
  if (!allFriendsWithStatus || allFriendsWithStatus.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">No friends found</p>
        <p className="text-sm text-muted-foreground">
          Start connecting with people to see them here.
        </p>
      </div>
    );
  }

  // 4️⃣ Success state
  return (
    <div className="pt-4">
      <div className="space-y-2">
        {allFriendsWithStatus.map(({ online, friend }) => {
          return (
            <UserListItem
              key={friend._id}
              user={
                localSpace.getUser()?._id === friend.friend._id
                  ? friend.user
                  : friend.friend
              }
              nameBadge={
                online ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  >
                    Online
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    Offline
                  </Badge>
                )
              }
              lslot={
                <div className="flex gap-2 items-center">
                  <Button variant={"outline"}>
                    <Link to={`/me/chats?userId=${friend.friend._id}`}>
                      <MessageCircleIcon />
                    </Link>
                  </Button>
                  <Button variant={"outline"}>
                    <Video />
                  </Button>
                  <Button variant={"outline"}>
                    <Phone />
                  </Button>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}
