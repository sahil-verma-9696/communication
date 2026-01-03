import { Chat } from "@/hooks/use-chatPage-logic";
import React from "react";

export type ChatPageContextType = {
  selectedChatId: string;
  setSelectedChatId: (chatId: string) => void;
  chats: Chat[] | null;
  handleChatClick: (chatId: string) => () => void;
  filters: { id: string; label: string }[];
  isLoading: boolean;
};

const ChatPageContext = React.createContext<ChatPageContextType | null>(null);

export function useChatPageContext() {
  const ctx = React.useContext(ChatPageContext);
  if (!ctx)
    throw new Error(
      "useChatPageContext must be used inside ChatPageContextProvider"
    );
  return ctx;
}
export default ChatPageContext;
