import { usePageContext } from "./_context";
import { Loader2, AlertCircle, Users } from "lucide-react";

export default function Page() {
  const ctx = usePageContext();
  const { allFriends, allFriendsError, loadingAllFriends } = ctx;

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
  if (!allFriends || allFriends.length === 0) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allFriends.map((friend) => (
        <div
          key={friend._id}
          className="flex items-center gap-3 rounded-lg border p-4"
        >
          {/* <img
            src={friend.avatar ?? "/avatar-placeholder.png"}
            alt={friend.name}
            className="h-10 w-10 rounded-full object-cover"
          /> */}

          <div className="flex-1">
            <p className="text-sm font-medium">{friend.name}</p>
            {friend.email && (
              <p className="text-xs text-muted-foreground">@{friend.name}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
