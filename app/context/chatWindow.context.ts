import { Message } from "@/hooks/use-chatWindow-logic";
import React from "react";

export type ChatWindowContextType = {
  messages: Message[] | null;
};

const ChatWindowContext = React.createContext<ChatWindowContextType | null>(
  null
);

export function useChatWindowContext() {
  const ctx = React.useContext(ChatWindowContext);
  if (!ctx)
    throw new Error(
      "useChatWindowContext must be used inside ChatWindowContextProvider"
    );
  return ctx;
}
export default ChatWindowContext;
