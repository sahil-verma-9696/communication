import { UserSearchResult } from "@/hooks/use-friendsTab-logic";
import { User } from "@/types/authentication.types";
import React from "react";

/**
 * FriendsPageContext Type
 * ----------------
 */
export type FriendsPageContextType = {
  friends: User[] | null;
  searchResults: UserSearchResult[] | null;
  query: string;
  handleQueryChange: (text: string) => void;
  handleAddFriendClick: (friendId: string) => () => void;
  searchUsers: (friendId: string) => () => Promise<void>;
  searchResultsLoading: boolean;
  friendsLoading: boolean;
};

/**
 * context
 * --------
 */
const FriendsPageContext = React.createContext<FriendsPageContextType | null>(
  null
);

export function useFriendsPageContext() {
  const ctx = React.useContext(FriendsPageContext);
  if (!ctx)
    throw new Error(
      "useFriendsPageContext must be used inside FriendsPageContextProvider"
    );
  return ctx;
}
export default FriendsPageContext;
