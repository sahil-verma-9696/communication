import { ScrollArea } from "@radix-ui/react-scroll-area";
import { usePageContext } from "./_context";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Edit3Icon, Mail, MapPin, Trash2Icon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/components/ui/badge";
import getNameAsAvtar from "@/services/getNameAsAvtar";

export default function Page() {
  const { userProfile, userProfileError, userProfileLoading } =
    usePageContext();

  if (userProfileLoading) return <div>Loading...</div>;
  if (userProfileError || !userProfile) return <div>{userProfileError}</div>;
  return (
    <div>
      <ScrollArea className="flex-1">
        <div className="p-6 flex flex-col items-center text-center">
          <Avatar className="rounded-full size-24 overflow-hidden">
            <AvatarImage
              src={userProfile.user.avatar || ""}
              alt={userProfile.user.name}
            />
            <AvatarFallback>
              {getNameAsAvtar(userProfile.user.name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{userProfile.user.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {userProfile.user.email || "Product Designer"}
          </p>

          <div className="flex gap-2 mt-6 w-full">
            <Button
              variant="outline"
              className="flex-1 rounded-xl gap-2 text-xs bg-transparent"
            >
              <Edit3Icon size={14} /> Profile
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl gap-2 text-white hover:text-destructive hover:bg-destructive/10 hover:cursor-pointer"
            >
              <Trash2Icon size={14} /> Delete
            </Button>
          </div>
        </div>

        <Separator />

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              User Details
            </h3>
            <div className="grid grid-cols-4">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium leading-none mb-1 space-x-3">
                    <span>Email</span>
                    <Badge
                      variant={"outline"}
                      className={`${userProfile.account.isEmailVerified ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}
                    >
                      {userProfile.account.isEmailVerified
                        ? "Verified"
                        : "Unverified"}
                    </Badge>
                  </p>
                  <p className="text-sm font-semibold">
                    {userProfile.user.email}
                  </p>
                </div>
              </div>
              {/* <DetailItem
                icon={<Phone size={16} />}
                label="Phone"
                value="+1 (555) 123-4567"
              /> */}
              <DetailItem
                icon={<MapPin size={16} />}
                label="Location"
                value={"None"}
              />
              <DetailItem
                icon={<Calendar size={16} />}
                label="Joined"
                value={new Date(
                  userProfile.account.createdAt,
                ).toLocaleDateString()}
              />
            </div>
          </section>

          <Separator />

          {userProfile.accountLifecycle && (
            <section className="space-y-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Important Info
              </h3>
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl gap-3"
                >
                  <span className="text-slate-600 font-bold uppercase">
                    Trial Expires At :
                  </span>
                  <span className="text-sm">
                    {new Date(
                      userProfile.accountLifecycle.trialEndAt,
                    ).toLocaleString()}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl gap-3"
                >
                  <span className="text-slate-600 font-bold uppercase">
                    Account Deleted At :
                  </span>
                  <span className="text-sm">
                    {new Date(
                      userProfile.accountLifecycle.accountDeletedAt,
                    ).toLocaleString()}
                  </span>
                </Button>
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground font-medium leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
