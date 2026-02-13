import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search } from "lucide-react";
import { UserListItem } from "./user-list-item";
import type { SearchResult } from "@/pages/friends/useMain";

type SearchResultsProps = {
  results: SearchResult[] | null;
  loading?: boolean;
  onSelect?: (item: SearchResult) => void;
  error: string | null;
};

export function SearchResults({
  results,
  loading = false,
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
            <UserListItem user={item} />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
