import { Friend, UserSearchResult } from "@/hooks/use-friendsTab-logic";
import { User } from "@/types/authentication.types";
import React from "react";

/**
 * FriendsPageContext Type
 * ----------------
 */
export type FriendsPageContextType = {
  friends: Friend[] | null;
  searchResults: UserSearchResult[] | null;
  query: string;
  searchResultsLoading: boolean;
  friendsLoading: boolean;
  startChatLoading: boolean;
  handleQueryChange: (text: string) => void;
  handleAddFriendClick: (friendId: string) => () => void;
  handleStartChat: (friendId: string) => () => void;
  handleMessage: (chatId: string) => () => void;
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
