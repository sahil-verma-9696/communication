import { SERVER_URL } from "@/app.constatns";
import useAsyncState from "@/hooks/use-async-state";
import localSpace from "@/services/local-space";
import type { User } from "@/services/auth";
import { getFriendChildrenRoutes } from "@/utils/getRoutes";
import React from "react";
import { useLocation, useNavigate } from "react-router";

export type SearchResult = User & {
  isFriend: boolean;
  directChatId: string | null;
};

export default function useMain() {
  const friendChilds = getFriendChildrenRoutes();
  const accessToken = localSpace.getAccessToken();

  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [query, setQuery] = React.useState<string>("");

  const {
    data: searchResults,
    setData: setSearchResults,
    error: searchResultsError,
    setError: setSearchResultsError,
    loading: searchResultsLoading,
    setLoading: setSearchResultsLoading,
  } = useAsyncState<SearchResult[]>();

  const handleValueChange = (value: string) => navigate(value);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(e.target.value);

    if (accessToken && value.length > 0) {
      setSearchResultsLoading(true);
      (async () => {
        try {
          const res = await fetch(`${SERVER_URL}/users?q=${value}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();

          setSearchResults(data);
          setSearchResultsLoading(false);
        } catch (error) {
          setSearchResultsError((error as Error).message);
          setSearchResultsLoading(false);
        }
      })();
    }
  };

  const handleSelectResult = () => {};

  // SET ACTIVE TAB
  React.useEffect(() => {
    const path = location.pathname.split("/").filter(Boolean).at(-1) ?? "all";
    setActiveTab(path);
  }, [location.pathname]);

  return {
    friendChilds,
    activeTab,
    handleValueChange,
    searchResults,
    searchResultsError,
    searchResultsLoading,
    query,
    handleQueryChange,
    handleSelectResult,
  };
}
