import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "@/contexts/auth.contex";
import type { SocketContextType } from "@/contexts/socket.context";
import localSpace from "@/services/local-space";
import { SERVER_URL } from "@/app.constatns";
import getBrowserInfo from "@/services/get-browserInfo";
import getDeviceId from "@/services/get-deviceId";

export default function useSocket(): SocketContextType {
  const [socket, setSocket] = useState<Socket | null>(null);

  const accessToken = localSpace.getAccessToken();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    // 🚫 Not authenticated → disconnect once
    if (!isAuthenticated || !accessToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket((prev) => {
        if (prev) {
          prev.disconnect();
          return null;
        }
        return prev; // 👈 no state change → no re-render
      });
      return;
    }

    // ✅ Already connected → do nothing
    setSocket((prev) => {
      if (prev) return prev;

      const newSocket = io(SERVER_URL, {
        auth: {
          token: accessToken,
          deviceId: getDeviceId(),
          browserInfo: getBrowserInfo(),
        },
      });

      return newSocket;
    });
  }, [isAuthenticated, accessToken]);

  return { socket };
}
