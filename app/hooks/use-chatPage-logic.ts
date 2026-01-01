import { ChatPageContextType } from "@/context/chatPage.context";
import { useGlobalContext } from "@/context/global.context";
import React from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";

export type Chat = {
  chatId: string;
  name?: string;
  description?: string;
  isArchived: boolean;
  joinedAt: string;
  lastMessage: string | null;
  type: "direct" | "group";
  role: string;
  unreadCount: number;
};

export default function useChatPageLogic(): ChatPageContextType {
  const [selectedChatId, setSelectedChatId] = React.useState<string>("");
  const [chats, setChats] = React.useState<Chat[] | null>(null);

  const { accessToken } = useGlobalContext();

  /*******************************************************************
   * *********************** USE EFFECTS ******************************
   *******************************************************************/

  /** Fetching chats */
  React.useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(`${SERVER_BASE_URL}/chats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        setChats(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats(null);
      }
    })();
  }, [accessToken]);

  return {
    selectedChatId,
    setSelectedChatId,
    chats,
  };
}
