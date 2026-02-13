import { UserListItem } from "@/components/user-list-item";
import useAsyncState from "@/hooks/use-async-state";
import {
  getFriendRequests,
  type FriendRequest,
} from "@/services/get-friendrequests";
import { Users } from "lucide-react";
import React from "react";

export default function Page() {
  const {
    data: friendReq,
    setData: setFriendReq,
    error: friendReqError,
    setError: setFriendReqError,
    loading: friendReqLoading,
    setLoading: setFriendReqLoading,
  } = useAsyncState<FriendRequest[]>();

  React.useEffect(() => {
    (async () => {
      try {
        setFriendReqLoading(true);
        const friendReq = await getFriendRequests();

        setFriendReq(friendReq);
        setFriendReqLoading(false);
      } catch (error) {
        setFriendReqError((error as Error).message);
        setFriendReqLoading(false);
      }
    })();
  }, []);

  if (friendReqLoading || !friendReq) return <div>Loading...</div>;
  if (friendReqError) return <div>{friendReqError}</div>;

  if (friendReq.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">No Friend Request Found</p>
        <p className="text-sm text-muted-foreground">
          You have no friend Requests
        </p>
      </div>
    );
  }

  return (
    <div className="pt-4">
      {friendReq.map((req) => {
        return <UserListItem user={req.sender} />;
      })}
    </div>
  );
}
