import useAsyncState from "@/hooks/use-async-state";
import {
  FriendRequestStatus,
  getUserProfile,
  type UserProfileResponse,
} from "@/services/get-userProfile";
import React from "react";
import { DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import { Badge } from "./ui/badge";
import { Calendar, Mail, Shield, UserPlus } from "lucide-react";
import { formatDate } from "@/utils/formate-string";
import { Button } from "./ui/button";
import { postFriendRequest } from "@/services/post-friendrequest";
import localSpace from "@/services/local-space";
import { patchFriendRequest } from "@/services/patch-friendrequest";
import { deleteFriendRequest } from "@/services/delete-friendrequest";

export function UserProfile({ userId }: { userId: string }) {
  const { data, setData, error, setError, loading, setLoading } =
    useAsyncState<UserProfileResponse>();

  const {
    // error: sendReqError,
    setError: setSendReqError,
    loading: sendReqLoading,
    setLoading: setSendReqLoading,
  } = useAsyncState();
  const {
    // error: acceptResponseError,
    setError: setAcceptResponseError,
    loading: acceptResponseLoading,
    setLoading: setAcceptResponseLoading,
  } = useAsyncState();
  const {
    // error: rejectResponseError,
    setError: setRejectResponseError,
    loading: rejectResponseLoading,
    setLoading: setRejectResponseLoading,
  } = useAsyncState();
  const {
    // error: cancelReqError,
    setError: setCancelReqError,
    loading: cancelReqLoading,
    setLoading: setCancelReqLoading,
  } = useAsyncState();

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile(userId);

        setData(userProfile);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    })();
  }, []);

  async function sendFriendRequest() {
    try {
      setSendReqLoading(true);
      const res = await postFriendRequest(userId);

      setData({ ...(data as UserProfileResponse), friendRequest: res });
      setSendReqLoading(false);
    } catch (error) {
      setSendReqError((error as Error).message);
      setSendReqLoading(false);
    }
  }

  async function cancelFriendRequest() {
    try {
      if (!data?.friendRequest?._id) return;
      setCancelReqLoading(true);
      await deleteFriendRequest(data?.friendRequest?._id);

      setData({ ...data, friendRequest: null });
      setCancelReqLoading(false);
    } catch (error) {
      setCancelReqError((error as Error).message);
      setCancelReqLoading(false);
    }
  }

  async function acceptFriendRequest() {
    try {
      if (!data?.friendRequest?._id) return;
      setAcceptResponseLoading(true);
      const res = await patchFriendRequest(data?.friendRequest?._id, {
        status: FriendRequestStatus.ACCEPTED,
      });

      setData({ ...(data as UserProfileResponse), friendRequest: res });
      setAcceptResponseLoading(false);
    } catch (error) {
      setAcceptResponseError((error as Error).message);
      setAcceptResponseLoading(false);
    }
  }

  async function rejectFriendRequest() {
    try {
      if (!data?.friendRequest?._id) return;
      setRejectResponseLoading(true);
      const res = await patchFriendRequest(data?.friendRequest?._id, {
        status: FriendRequestStatus.REJECTED,
      });

      setData({ ...(data as UserProfileResponse), friendRequest: res });
      setRejectResponseLoading(false);
    } catch (error) {
      setRejectResponseError((error as Error).message);
      setRejectResponseLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!data) return <div>No data</div>;

  return (
    <div>
      <DialogHeader>
        <DialogTitle>User Profile</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Avatar and Basic Info */}

        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={data.user.avatar || ""} alt={data.user.name} />
            <AvatarFallback className="text-lg font-semibold">
              {getNameAsAvtar(data.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{data.user.name}</h2>
            <Badge
              variant={
                data.account.status === "active" ? "default" : "secondary"
              }
              className="mt-2"
            >
              {data.account.status.charAt(0).toUpperCase() +
                data.account.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* User Details */}
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          User Details
        </h3>
        <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="truncate text-sm font-medium">{data.user.email}</p>
            </div>
          </div>

          {/* Email Verification Status */}
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email Verified</p>
              <p className="text-sm font-medium">
                {data.account.isEmailVerified ? (
                  <Badge
                    variant={"outline"}
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  >
                    Yes
                  </Badge>
                ) : (
                  <Badge
                    variant={"outline"}
                    className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    No
                  </Badge>
                )}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium">
                {formatDate(data.user.createdAt)}
              </p>
            </div>
          </div>

          {/* Trial End */}
          {data.accountLifecycle?.trialEndAt && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Trial Ends</p>
                <p className="text-sm font-medium">
                  {formatDate(data.accountLifecycle?.trialEndAt)}
                </p>
              </div>
            </div>
          )}

          {/* FriendRequest Status */}
          {data.friendRequest && (
            <div className="flex items-center gap-3">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Friend Request</p>
                {data.friendRequest.status === FriendRequestStatus.PENDING && (
                  <Badge
                    variant={"outline"}
                    className="bg-green-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                  >
                    Pending
                  </Badge>
                )}
                {data.friendRequest.status === FriendRequestStatus.ACCEPTED && (
                  <Badge
                    variant={"outline"}
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  >
                    Accepted
                  </Badge>
                )}
                {data.friendRequest.status === FriendRequestStatus.REJECTED && (
                  <Badge
                    variant={"outline"}
                    className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    Rejected
                  </Badge>
                )}
                <span className="text-sm">
                  - {new Date(data.friendRequest.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Actions
        </h3>
        {/* Action Button */}

        {/* Send Friend Request */}
        {!data.friendRequest && (
          <Button
            onClick={sendFriendRequest}
            disabled={sendReqLoading}
            className="w-full bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {sendReqLoading ? "Sending Request..." : "Send Friend Request"}
          </Button>
        )}

        {/* Cancel Friend Request */}
        {data.friendRequest?.status === FriendRequestStatus.PENDING &&
          data.friendRequest.sender === localSpace.getUser()?._id && (
            <Button
              onClick={cancelFriendRequest}
              disabled={cancelReqLoading}
              className="w-full bg-red-500 hover:bg-red-600"
              size="lg"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {cancelReqLoading
                ? "Cancelling Request..."
                : "Cancel Friend Request"}
            </Button>
          )}

        <div className="flex gap-2">
          {/* Accept Friend Request */}
          {data.friendRequest?.status === FriendRequestStatus.PENDING &&
            data.friendRequest.receiver === localSpace.getUser()?._id && (
              <Button
                onClick={acceptFriendRequest}
                disabled={acceptResponseLoading}
                className="w-1/2 bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {acceptResponseLoading
                  ? "Accepting Request..."
                  : "Accept Friend Request"}
              </Button>
            )}

          {/* Reject Friend Request */}
          {data.friendRequest?.status === FriendRequestStatus.PENDING &&
            data.friendRequest.receiver === localSpace.getUser()?._id && (
              <Button
                onClick={rejectFriendRequest}
                disabled={rejectResponseLoading}
                className="w-1/2 bg-red-500 hover:bg-red-600"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {rejectResponseLoading
                  ? "Rejecting Request..."
                  : "Reject Friend Request"}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
