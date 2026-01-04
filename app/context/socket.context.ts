import React from "react";
import { Socket } from "socket.io-client";

export type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = React.createContext<SocketContextType | null>(null);

export default SocketContext;

export function useSocket() {
  const ctx = React.useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
}
