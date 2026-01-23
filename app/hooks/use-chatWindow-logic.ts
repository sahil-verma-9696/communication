import { useGlobalContext } from "@/context/global.context";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { User } from "@/types/authentication.types";
import { useSocket } from "@/context/socket.context";
import socketEvents from "@/constants/socket-events";

export type Message = { _id: string; text: string; sender: User | null };

export default function useChatWindowLogic() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [text, setText] = useState<string>("");
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { accessToken, userEmail } = useGlobalContext();
  const { socket } = useSocket();

  /********************************************************
   * ********************** Handlers *********************
   *************************************************************/

  const handleSendMessage = () => () => {
    if (!accessToken) return;
    (async () => {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ text, chatId, type: "text" }),
        });
        const resData = await res.json();
        console.log("Sended Message : ", resData);
        setMessages((prev) => [...(prev || []), resData]);
        setText("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    })();
  };

  /**
   * Handle emit of join room
   */
  const wsHandleJoinRoom = useCallback(() => {
    if (!socket) return;
    console.log("wsHandleJoinRoom");
    socket.emit(socketEvents.JOIN_CHAT, chatId);
  }, [socket, chatId]);

  /**
   * Handle emit of leave room
   */
  const wsLeaveRoom = useCallback(() => {
    console.log("wsLeaveRoom");
    if (!socket) return;
    socket.emit(socketEvents.LEAVE_CHAT, chatId);
  }, [socket, chatId]);

  /**
   * Lister for new messages
   */
  const wsHandleMessage = useCallback((message: Message) => {
    console.log("wsHandleMessage", userEmail, message);
    setMessages((prev) => [...(prev || []), message]);
  }, []);

  /********************************************************
   * ********************** Effects *********************
   *************************************************************/

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
        setMessages(resData);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setMessages(null);
      }
    })();
  }, [accessToken, chatId]);

  /**
   * Handle join & leave room
   */
  useEffect(() => {
    wsHandleJoinRoom();
    return () => wsLeaveRoom();
  }, [socket, wsHandleJoinRoom, wsLeaveRoom]);

  /**
   * Handle new messages
   */
  useEffect(() => {
    if (!socket) return;
    socket.on(socketEvents.MESSAGE, wsHandleMessage);
    return () => {
      socket.off(socketEvents.MESSAGE, wsHandleMessage);
    };
  }, [socket, wsHandleMessage]);

  return { messages, text, setText, handleSendMessage };
}
