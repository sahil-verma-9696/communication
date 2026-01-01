import GlobalContext from "@/context/global.context";
import useGlobalContextLogic from "@/hooks/use-globalContext-logic";

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const contextValue = useGlobalContextLogic();
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}
