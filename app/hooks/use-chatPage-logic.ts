import { ChatPageContextType } from "@/context/chatPage.context";
import { useGlobalContext } from "@/context/global.context";
import React from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { router } from "expo-router";

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
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "favorite", label: "Favorite" },
  ];
  const [selectedChatId, setSelectedChatId] = React.useState<string>("");
  const [chats, setChats] = React.useState<Chat[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { accessToken } = useGlobalContext();

  /*******************************************************************
   * *********************** Handlers ******************************
   *******************************************************************/
  const handleChatClick = (chatId: string) => () => {
    setSelectedChatId(chatId);
    router.push({
      pathname: "/chats/[chatId]",
      params: { chatId },
    });
  };
  /*******************************************************************
   * *********************** USE EFFECTS ******************************
   *******************************************************************/

  /** Fetching chats */
  React.useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${SERVER_BASE_URL}/chats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const resData = await res.json();
        setChats(resData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats(null);
        setIsLoading(false);
      }
    })();
  }, [accessToken]);

  return {
    selectedChatId,
    setSelectedChatId,
    handleChatClick,
    chats,
    filters,
    isLoading,
  };
}
