import { cn } from "@/lib/utils";
import { usePageContext } from "./_context";
import { Loader2, AlertCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const ctx = usePageContext();
  const { allFriendsWithStatus, allFriendsError, loadingAllFriends } = ctx;

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
    <div className="pt-4 space-y-2">
      <div className="space-y-2 pt-4">
        {allFriendsWithStatus.map((friend) => {
          const isOnline = friend.online;

          return (
            <div
              key={friend._id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition",
                isOnline
                  ? "bg-background opacity-100"
                  : "bg-muted/40 opacity-60",
              )}
            >
              {/* Avatar placeholder */}
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold",
                  isOnline
                    ? "bg-green-500/10 text-green-600"
                    : "bg-gray-300 text-gray-600",
                )}
              >
                {friend.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{friend.name}</p>
                {friend.email && (
                  <p className="text-xs text-muted-foreground">
                    {friend.email}
                  </p>
                )}
              </div>

              {/* Status badge */}
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  isOnline && "bg-green-600 hover:bg-green-600",
                )}
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
