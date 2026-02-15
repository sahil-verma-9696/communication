import type { User } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { UserProfile } from "./user-profile";

export function UserListItem({
  user,
  lslot,
  nameBadge,
}: {
  user: User;
  lslot?: React.ReactNode;
  nameBadge?: React.ReactNode;
}) {
  return (
    <Card
      data-slot="user-list-item"
      className="w-full rounded-md p-2 text-left hover:bg-accent focus:bg-accent focus:outline-none flex flex-row items-center justify-between shadow-none border-none"
    >
      <div className="flex items-center gap-2">
        <Avatar className="rounded-full size-12 overflow-hidden bg-gray-200 flex justify-center items-center">
          <AvatarImage src={user.avatar || ""} alt={user.name} />
          <AvatarFallback>{getNameAsAvtar(user.name)}</AvatarFallback>
        </Avatar>
        <div className="w-fit">
          <Dialog>
            <DialogTrigger asChild>
              <span className="font-medium cursor-pointer">
                {user.name} {nameBadge}
              </span>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <UserProfile userId={user._id} />
            </DialogContent>
          </Dialog>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      {lslot}
    </Card>
  );
}
