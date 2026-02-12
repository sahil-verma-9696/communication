import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { SearchResult } from "@/pages/friends/useMain";
import {
  Loader2,
  Search,
} from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import getNameAsAvtar from "@/services/getNameAsAvtar";
import { UserProfile } from "./user-profile";

type SearchResultsProps = {
  results: SearchResult[] | null;
  loading?: boolean;
  onSelect?: (item: SearchResult) => void;
  error: string | null;
};

export function SearchResults({
  results,
  loading = false,
  onSelect,
  error,
}: SearchResultsProps) {
  if (loading) {
    return (
      <Card className="mt-2">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (results?.length === 0) {
    return (
      <Card className="mt-2">
        <CardContent className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <Search className="h-5 w-5" />
          <span className="text-sm">No results found</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-2">
        <CardContent className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <Search className="h-5 w-5" />
          <span className="text-sm">{error || "Something went wrong."}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-2 p-1">
      <ScrollArea className="h-72">
        <CardContent className="p-1 py-1">
          {results?.map((item) => (
            <div
              key={item._id}
              onClick={() => onSelect?.(item)}
              className="w-full rounded-md p-2 text-left hover:bg-accent focus:bg-accent focus:outline-none flex justify-between"
            >
              <div className="flex gap-2">
                <Avatar className="rounded-full size-12 overflow-hidden bg-gray-200 flex justify-center items-center">
                  <AvatarImage src={item.avatar || ""} alt={item.name} />
                  <AvatarFallback>{getNameAsAvtar(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="font-medium cursor-pointer">
                        {item.name}
                      </div>
                    </DialogTrigger>
                    <DialogContent showCloseButton={false}>
                      <UserProfile userId={item._id} />
                    </DialogContent>
                  </Dialog>

                  <div className="text-sm text-muted-foreground">
                    {item.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
