import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { useSocket } from "@/context/socket.context";
import socketEvents from "@/constants/socket-events";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: Date;
};
export default function useNotificationTabLogic() {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  );
  const globalCtx = useGlobalContext();
  const { socket } = useSocket();
  const { accessToken } = globalCtx;

  const wsNotificationHandler = (notification: Notification) => {
    console.log("WS : Notification Received : ", notification);
    setNotifications((prev) => [notification, ...(prev || [])]);
  };

  /********************************************************
   * ********************** Effects *********************
   *************************************************************/

  // Fetch notifications
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        console.log(data, "notifications");
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications(null);
      }
    })();
  }, []);

  // Listen for new notifications  (WebSocket)
  useEffect(() => {
    if (socket) {
      socket.on(socketEvents.NOTIFICATION, wsNotificationHandler);
    }
    return () => {
      if (socket) {
        socket.off(socketEvents.NOTIFICATION, wsNotificationHandler);
      }
    };
  }, [socket]);
  return { notifications };
}
