import SocketContext from "@/context/socket.context";
import useSocketContextLogic from "@/hooks/use-socketContext-logic";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = useSocketContextLogic();
  return (
    <SocketContext.Provider value={ctx}>{children}</SocketContext.Provider>
  );
}
