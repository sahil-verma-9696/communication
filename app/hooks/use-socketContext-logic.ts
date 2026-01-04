import { useGlobalContext } from "@/context/global.context";
import { SocketContextType } from "@/context/socket.context";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_BASE_URL } from "./use-authContext-logic";
import { useAuthContext } from "@/context/auth.context";

export default function useSocketContextLogic(): SocketContextType {
  /********************************************************
   * ********************** Reference Variable *********************
   *************************************************************/
  const socketRef = useRef<Socket | null>(null);

  /********************************************************
   * ********************** Other Hooks *********************
   *************************************************************/
  const { accessToken } = useGlobalContext();
  const { isLoggedIn } = useAuthContext();

  /********************************************************
   * ********************** Effects *********************
   *************************************************************/

  /**
   * Connect socket on mount
   */
  useEffect(() => {
    (async () => {
      try {
        if (isLoggedIn && accessToken && !socketRef.current) {
          if (!socketRef.current) {
            socketRef.current = io(SERVER_BASE_URL, {
              auth: {
                token: accessToken,
              },
            });
          }
        } else {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        }
      } catch (error) {
        console.error("Error connecting to socket:", error);
      }
    })();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, isLoggedIn]);
  /********************************************************
   * ********************** Return Value *********************
   *************************************************************/
  return {
    socket: socketRef.current,
  };
}
