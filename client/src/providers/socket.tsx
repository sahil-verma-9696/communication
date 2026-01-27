import SocketContext from "@/contexts/socket.context";
import useSocket from "@/hooks/use-socket";

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketContext.Provider value={useSocket()}>
      {children}
    </SocketContext.Provider>
  );
}
