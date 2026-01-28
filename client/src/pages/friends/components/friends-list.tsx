import type { FriendListResponse } from "@/services/get-freinds";
import { Loader2, AlertCircle, Users } from "lucide-react";

export type FriendsListProps = {
  friends: FriendListResponse[] | null;
  error: string | null;
  loading: boolean;
};

export default function FriendsList(props: FriendsListProps) {
  const { friends, error, loading } = props;

  // 1️⃣ Loading state
  if (loading) {
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
  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm font-medium">Failed to load friends</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // 3️⃣ Empty state
  if (!friends || friends.length === 0) {
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
    <div className="pt-4 space-y-2">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50"
        >
          {/* <img
            src={friend.avatar ?? "/avatar-placeholder.png"}
            alt={friend.name}
            className="h-10 w-10 rounded-full object-cover"
          /> */}

          <div className="flex-1">
            <p className="text-sm font-medium">{friend.name}</p>
            {friend.email && (
              <p className="text-xs text-muted-foreground">{friend.email}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
