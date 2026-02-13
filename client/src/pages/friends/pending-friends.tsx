import { UserListItem } from "@/components/user-list-item";
import useAsyncState from "@/hooks/use-async-state";
import {
  getPendingFriendRequests,
  type PendingRequest,
} from "@/services/get-pending-friendRequests";
import { Users } from "lucide-react";
import React from "react";

export default function Page() {
  const {
    data: pendingReq,
    setData: setPendingReq,
    error: pendingReqError,
    setError: setPendingReqError,
    loading: pendingReqLoading,
    setLoading: setPendingReqLoading,
  } = useAsyncState<PendingRequest[]>();

  React.useEffect(() => {
    (async () => {
      try {
        setPendingReqLoading(true);
        const pendingReq = await getPendingFriendRequests();

        setPendingReq(pendingReq);
        setPendingReqLoading(false);
      } catch (error) {
        setPendingReqError((error as Error).message);
        setPendingReqLoading(false);
      }
    })();
  }, []);

  if (pendingReqLoading || !pendingReq) return <div>Loading...</div>;
  if (pendingReqError) return <div>{pendingReqError}</div>;

  if (pendingReq.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium">No Friend Request Found</p>
        <p className="text-sm text-muted-foreground">
          You have no Pending friend Requests
        </p>
      </div>
    );
  }
  return (
    <div className="pt-4">
      {pendingReq.map((req) => {
        return <UserListItem user={req.receiver} />;
      })}
    </div>
  );
}
