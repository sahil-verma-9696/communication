import type { User } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { UserProfile } from "./user-profile";

export function UserListItem({ user }: { user: User }) {
  return (
    <Card className="w-full rounded-md p-2 text-left hover:bg-accent focus:bg-accent focus:outline-none flex justify-between shadow-none border-none">
      <div className="flex gap-2">
        <Avatar className="rounded-full size-12 overflow-hidden bg-gray-200 flex justify-center items-center">
          <AvatarImage src={user.avatar || ""} alt={user.name} />
          <AvatarFallback>{getNameAsAvtar(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="font-medium cursor-pointer">{user.name}</div>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <UserProfile userId={user._id} />
            </DialogContent>
          </Dialog>

          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>
    </Card>
  );
}
