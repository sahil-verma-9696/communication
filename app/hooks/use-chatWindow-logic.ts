import { useGlobalContext } from "@/context/global.context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";

export type Message = { _id: string; text: string };

export default function useChatWindowLogic() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { accessToken } = useGlobalContext();

  /** Fetching messages */
  useEffect(() => {
    (async () => {
      if (!accessToken) return;
      try {
        const res = await fetch(
          `${SERVER_BASE_URL}/messages?chatId=${chatId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const resData = await res.json();
        console.log(resData, "resData");
        setMessages(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setMessages(null);
      }
    })();
  }, [accessToken, chatId]);

  return { messages };
}
