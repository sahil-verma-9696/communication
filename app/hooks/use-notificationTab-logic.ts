import { useGlobalContext } from "@/context/global.context";
import { useEffect, useState } from "react";
import { SERVER_BASE_URL } from "./use-authContext-logic";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  createdAt: Date;
};
export default function useNotificationTabLogic() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const globalCtx = useGlobalContext();
  const { accessToken } = globalCtx;
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
  return { notifications };
}
